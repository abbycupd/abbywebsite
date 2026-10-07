"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, Trash2, X } from "lucide-react";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { RichTextEditor } from "@/components/admin/editor/rich-text-editor";
import { SaveStatus, type SaveState } from "@/components/admin/save-status";
import {
  createDraft,
  deletePost,
  fetchPostById,
  isSlugTaken,
  publishPost,
  unpublishPost,
  updatePostContent,
  uploadJournalImage,
} from "@/lib/notes/admin-queries";
import { collectImageSrcs } from "@/lib/notes/content";
import { toFriendlyError } from "@/lib/notes/errors";
import { estimateReadingTime } from "@/lib/notes/reading-time";
import { slugify } from "@/lib/notes/slug";
import { EMPTY_DOC, type JournalDoc, type JournalPostInput, type PostStatus } from "@/lib/notes/types";

const AUTOSAVE_DELAY_MS = 1500;

type FormState = {
  title: string;
  slug: string;
  excerpt: string;
  content: JournalDoc;
  coverImage: string | null;
  tags: string[];
  metaDescription: string;
};

const BLANK_FORM: FormState = {
  title: "",
  slug: "",
  excerpt: "",
  content: EMPTY_DOC,
  coverImage: null,
  tags: [],
  metaDescription: "",
};

function toInput(form: FormState): JournalPostInput {
  return {
    title: form.title.trim(),
    slug: form.slug.trim(),
    excerpt: form.excerpt.trim(),
    content: form.content,
    cover_image: form.coverImage,
    tags: form.tags,
    meta_description: form.metaDescription.trim() || null,
  };
}

export function PostEditor({ id }: { id?: string }) {
  const [postId, setPostId] = useState<string | null>(id ?? null);
  const [status, setStatus] = useState<PostStatus>("draft");
  const [form, setForm] = useState<FormState>(BLANK_FORM);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(Boolean(id));
  const [loading, setLoading] = useState(Boolean(id));
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const router = useRouter();

  const skipAutosaveRef = useRef(true);
  const deletingRef = useRef(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const formRef = useRef(form);
  formRef.current = form;

  useEffect(() => {
    if (!id) return;
    fetchPostById(id)
      .then((post) => {
        if (!post) {
          setLoadError("This post doesn't exist, or may have been deleted.");
          return;
        }
        setForm({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          coverImage: post.cover_image,
          tags: post.tags,
          metaDescription: post.meta_description ?? "",
        });
        setStatus(post.status);
        skipAutosaveRef.current = true;
      })
      .catch((err) => setLoadError(toFriendlyError(err, "Couldn't load this post")))
      .finally(() => setLoading(false));
  }, [id]);

  const persist = useCallback(async (currentPostId: string, input: JournalPostInput): Promise<boolean> => {
    setSaveState("saving");
    try {
      if (input.slug) {
        const taken = await isSlugTaken(input.slug, currentPostId);
        if (taken) {
          setSaveState("error");
          setSaveError("That URL (slug) is already used by another post.");
          return false;
        }
      }
      await updatePostContent(currentPostId, input);
      setSaveState("saved");
      setSaveError(null);
      return true;
    } catch (err) {
      setSaveState("error");
      setSaveError(toFriendlyError(err));
      return false;
    }
  }, []);

  // Debounced autosave — only once a draft row exists, and only for content
  // fields. Status/publish state is never touched here (see handlePublish /
  // handleUnpublish), so autosave can never accidentally publish a draft.
  useEffect(() => {
    if (skipAutosaveRef.current) {
      skipAutosaveRef.current = false;
      return;
    }
    if (deletingRef.current) return;
    if (!postId) {
      setSaveState("unsaved");
      return;
    }
    setSaveState("unsaved");
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      persist(postId, toInput(formRef.current));
    }, AUTOSAVE_DELAY_MS);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, postId, persist]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleTitleChange(value: string) {
    setForm((prev) => ({
      ...prev,
      title: value,
      slug: slugManuallyEdited ? prev.slug : slugify(value),
    }));
  }

  function handleSlugBlur() {
    setForm((prev) => ({ ...prev, slug: slugify(prev.slug) }));
  }

  function addTag() {
    const next = tagInput.trim().toLowerCase();
    if (next && !form.tags.includes(next)) {
      updateField("tags", [...form.tags, next]);
    }
    setTagInput("");
  }

  function removeTag(tag: string) {
    updateField(
      "tags",
      form.tags.filter((t) => t !== tag)
    );
  }

  function ensureSlug(): string {
    const current = slugify(formRef.current.slug || formRef.current.title);
    if (current) return current;
    return `untitled-${Date.now().toString(36)}`;
  }

  /** Returns the post's id on success, or null if saving failed (error is
   * already shown via saveState). Returns the id directly rather than
   * relying on the `postId` state var, which wouldn't be updated yet in the
   * same tick a caller like handlePublish awaits this. */
  async function handleSaveDraft(): Promise<string | null> {
    const slug = ensureSlug();
    setForm((prev) => ({ ...prev, slug }));
    setSaveState("saving");
    try {
      const taken = await isSlugTaken(slug);
      if (taken) {
        setSaveState("error");
        setSaveError("That URL (slug) is already used by another post.");
        return null;
      }
      const created = await createDraft({ ...toInput(formRef.current), slug });
      setPostId(created.id);
      setStatus(created.status);
      skipAutosaveRef.current = true;
      setSaveState("saved");
      setSaveError(null);
      window.history.replaceState(null, "", `/admin/editor?id=${created.id}`);
      return created.id;
    } catch (err) {
      setSaveState("error");
      setSaveError(toFriendlyError(err, "Couldn't save draft"));
      return null;
    }
  }

  async function flushPendingSave(currentId: string): Promise<boolean> {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    return persist(currentId, toInput(formRef.current));
  }

  async function handlePublish() {
    const currentId = postId ?? (await handleSaveDraft());
    if (!currentId) return; // handleSaveDraft failed; error already shown
    const flushed = await flushPendingSave(currentId);
    if (!flushed) return; // latest edits failed to save; don't publish stale/partial content
    setSaveState("saving");
    try {
      await publishPost(currentId);
      setStatus("published");
      setSaveState("saved");
      setSaveError(null);
    } catch (err) {
      setSaveState("error");
      setSaveError(toFriendlyError(err, "Couldn't publish"));
    }
  }

  async function handleUnpublish() {
    if (!postId) return;
    try {
      await unpublishPost(postId);
      setStatus("draft");
    } catch (err) {
      setSaveState("error");
      setSaveError(toFriendlyError(err, "Couldn't unpublish"));
    }
  }

  async function handleDelete() {
    if (!postId || deleting) return;
    const hadUnsavedEdits = saveState === "unsaved";
    // Stop autosave so a pending save can't race the delete (or try to
    // update a row that no longer exists).
    deletingRef.current = true;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    setDeleting(true);
    setDeleteError(null);
    try {
      const current = formRef.current;
      await deletePost(postId, [current.coverImage, ...collectImageSrcs(current.content)].filter(
        (url): url is string => Boolean(url)
      ));
      router.push("/admin");
    } catch (err) {
      deletingRef.current = false;
      setDeleting(false);
      setDeleteError(toFriendlyError(err, "Couldn't delete"));
      // The post still exists — save whatever autosave was about to save.
      if (hadUnsavedEdits) persist(postId, toInput(formRef.current));
    }
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const url = await uploadJournalImage(file, "covers");
      updateField("coverImage", url);
    } catch (err) {
      setSaveState("error");
      setSaveError(toFriendlyError(err, "Couldn't upload cover image"));
    }
  }

  if (loading) {
    return (
      <div className="container-page flex min-h-[50vh] items-center justify-center py-16">
        <p className="label">loading…</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="container-page py-16">
        <p className="label mb-4 text-roast">{loadError}</p>
        <Link href="/admin" className="label inline-flex items-center gap-1.5 hover:text-ink">
          <ArrowLeft size={13} /> back to notes
        </Link>
      </div>
    );
  }

  return (
    <main id="main" className="container-page max-w-[720px] py-16">
      <div className="flex items-center justify-between">
        <Link href="/admin" className="label inline-flex items-center gap-1.5 text-graphite hover:text-ink">
          <ArrowLeft size={13} /> all notes
        </Link>
        <div className="flex items-center gap-4">
          <SaveStatus state={saveState} errorMessage={saveError} />
          {postId && (
            <Link
              href={`/admin/preview?id=${postId}`}
              target="_blank"
              className="label inline-flex items-center gap-1.5 text-graphite hover:text-ink"
            >
              <Eye size={14} /> preview
            </Link>
          )}
        </div>
      </div>

      <input
        value={form.title}
        onChange={(e) => handleTitleChange(e.target.value)}
        placeholder="Untitled"
        className="mt-10 w-full bg-transparent font-display text-3xl font-semibold tracking-tight text-ink outline-none placeholder:text-graphite/40 sm:text-4xl"
      />

      <textarea
        value={form.excerpt}
        onChange={(e) => updateField("excerpt", e.target.value)}
        placeholder="Add a one-line excerpt…"
        rows={2}
        className="mt-3 w-full resize-none bg-transparent text-graphite outline-none placeholder:text-graphite/40"
      />

      <p className="label mt-2">
        /notes/{form.slug || "…"} · ~{estimateReadingTime(form.content)} min read
      </p>

      <div className="mt-6">
        {form.coverImage ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={form.coverImage} alt="" className="w-full rounded-md border border-mist" />
            <button
              onClick={() => updateField("coverImage", null)}
              className="absolute right-2 top-2 rounded-full bg-ink/80 p-1.5 text-cream hover:bg-ink"
              title="Remove cover image"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <label className="label inline-flex cursor-pointer items-center gap-2 rounded-full border border-mist px-3 py-1.5 text-graphite hover:border-ink/30 hover:text-ink">
            add cover image
            <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
          </label>
        )}
      </div>

      <div className="mt-8">
        <RichTextEditor
          content={form.content}
          onChange={(doc) => updateField("content", doc)}
          onUploadError={(message) => {
            setSaveState("error");
            setSaveError(message);
          }}
        />
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-1.5">
        {form.tags.map((tag) => (
          <span key={tag} className="label inline-flex items-center gap-1 rounded-full border border-mist px-2.5 py-1">
            {tag}
            <button onClick={() => removeTag(tag)} aria-label={`Remove tag ${tag}`}>
              <X size={11} />
            </button>
          </span>
        ))}
        <input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addTag();
            }
          }}
          onBlur={addTag}
          placeholder="add a tag…"
          className="label min-w-[100px] flex-1 bg-transparent outline-none placeholder:text-graphite/40"
        />
      </div>

      <details className="mt-10 border-t border-mist pt-6">
        <summary className="label cursor-pointer select-none">advanced: slug & SEO</summary>
        <div className="mt-4 space-y-4">
          <div>
            <label className="label mb-1.5 block">url slug</label>
            <input
              value={form.slug}
              onChange={(e) => {
                setSlugManuallyEdited(true);
                updateField("slug", e.target.value);
              }}
              onBlur={handleSlugBlur}
              className="w-full rounded-md border border-mist bg-paper px-3 py-2 text-sm text-ink outline-none focus-visible:border-roast"
            />
          </div>
          <div>
            <label className="label mb-1.5 block">SEO description (optional)</label>
            <textarea
              value={form.metaDescription}
              onChange={(e) => updateField("metaDescription", e.target.value)}
              rows={2}
              placeholder="Falls back to the excerpt if left blank."
              className="w-full resize-none rounded-md border border-mist bg-paper px-3 py-2 text-sm text-ink outline-none placeholder:text-graphite/40 focus-visible:border-roast"
            />
          </div>
        </div>
      </details>

      <div className="mt-10 flex items-center gap-3 border-t border-mist pt-6">
        {!postId && (
          <button
            onClick={handleSaveDraft}
            className="label rounded-full border border-ink px-4 py-2 text-ink transition-colors hover:bg-ink hover:text-cream"
          >
            save draft
          </button>
        )}
        {status === "draft" ? (
          <button
            onClick={handlePublish}
            className="label rounded-full border border-roast bg-roast px-4 py-2 text-cream transition-opacity hover:opacity-90"
          >
            publish
          </button>
        ) : (
          <button
            onClick={handleUnpublish}
            className="label rounded-full border border-mist px-4 py-2 text-graphite transition-colors hover:border-ink/30 hover:text-ink"
          >
            unpublish (return to draft)
          </button>
        )}
        {postId && (
          <button
            onClick={() => {
              setDeleteError(null);
              setConfirmingDelete(true);
            }}
            disabled={deleting}
            className="label ml-auto inline-flex items-center gap-1.5 text-graphite transition-colors hover:text-roast disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 size={13} /> delete
          </button>
        )}
      </div>

      <ConfirmDialog
        open={confirmingDelete}
        title="Delete this note?"
        description={`This will permanently delete “${form.title.trim() || "Untitled"}”. This cannot be undone.`}
        confirmLabel="delete note"
        busyLabel="deleting…"
        busy={deleting}
        error={deleteError}
        onConfirm={handleDelete}
        onCancel={() => {
          setConfirmingDelete(false);
          setDeleteError(null);
        }}
      />
    </main>
  );
}
