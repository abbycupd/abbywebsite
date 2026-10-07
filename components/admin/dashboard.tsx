"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, LogOut } from "lucide-react";
import { fetchAllPostsForAdmin, publishPost, unpublishPost, deletePost } from "@/lib/notes/admin-queries";
import { toFriendlyError } from "@/lib/notes/errors";
import { useAdminSession } from "@/lib/auth/use-admin-session";
import { PostRow } from "@/components/admin/post-row";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import type { JournalPost } from "@/lib/notes/types";

export function Dashboard() {
  const { signOut } = useAdminSession();
  const [posts, setPosts] = useState<JournalPost[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<JournalPost | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function reload() {
    try {
      setPosts(await fetchAllPostsForAdmin());
    } catch (err) {
      setError(toFriendlyError(err, "Couldn't load posts"));
    }
  }

  useEffect(() => {
    reload();
  }, []);

  async function handlePublish(id: string) {
    try {
      await publishPost(id);
      await reload();
    } catch (err) {
      setError(toFriendlyError(err, "Couldn't publish"));
    }
  }

  async function handleUnpublish(id: string) {
    try {
      await unpublishPost(id);
      await reload();
    } catch (err) {
      setError(toFriendlyError(err, "Couldn't unpublish"));
    }
  }

  function askToDelete(post: JournalPost) {
    setDeleteError(null);
    setPendingDelete(post);
  }

  function cancelDelete() {
    if (deleting) return;
    setPendingDelete(null);
    setDeleteError(null);
  }

  async function handleDelete() {
    if (!pendingDelete || deleting) return;
    const target = pendingDelete;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deletePost(target.id);
      // Drop it locally rather than refetching, so it vanishes immediately.
      setPosts((prev) => prev?.filter((p) => p.id !== target.id) ?? prev);
      setPendingDelete(null);
    } catch (err) {
      // Keep the dialog open with the error — nothing was removed.
      setDeleteError(toFriendlyError(err, "Couldn't delete"));
    } finally {
      setDeleting(false);
    }
  }

  const drafts = posts?.filter((p) => p.status === "draft") ?? [];
  const published = posts?.filter((p) => p.status === "published") ?? [];

  return (
    <main id="main" className="container-page py-16">
      <div className="flex items-center justify-between">
        <p className="label">abby brennan / admin</p>
        <button onClick={signOut} className="label inline-flex items-center gap-1.5 text-graphite hover:text-ink">
          <LogOut size={13} />
          sign out
        </button>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Notes</h1>
        <Link
          href="/admin/editor"
          className="label inline-flex items-center gap-1.5 rounded-full border border-ink px-4 py-2 text-ink transition-colors hover:bg-ink hover:text-cream"
        >
          <Plus size={14} />
          new post
        </Link>
      </div>

      {error && (
        <p className="label mt-6 rounded-md border border-roast/40 bg-roast/5 px-4 py-3 text-roast">{error}</p>
      )}

      {posts === null ? (
        <p className="label mt-10">loading…</p>
      ) : (
        <>
          <section className="mt-12">
            <p className="label mb-2 text-graphite">drafts</p>
            <div className="divide-y divide-mist border-y border-mist">
              {drafts.length === 0 && <p className="py-6 text-sm text-graphite">No drafts right now.</p>}
              {drafts.map((post) => (
                <PostRow
                  key={post.id}
                  post={post}
                  onPublish={handlePublish}
                  onUnpublish={handleUnpublish}
                  onDelete={askToDelete}
                />
              ))}
            </div>
          </section>

          <section className="mt-12">
            <p className="label mb-2 text-graphite">published</p>
            <div className="divide-y divide-mist border-y border-mist">
              {published.length === 0 && <p className="py-6 text-sm text-graphite">Nothing published yet.</p>}
              {published.map((post) => (
                <PostRow
                  key={post.id}
                  post={post}
                  onPublish={handlePublish}
                  onUnpublish={handleUnpublish}
                  onDelete={askToDelete}
                />
              ))}
            </div>
          </section>
        </>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this note?"
        description={`This will permanently delete “${pendingDelete?.title || "Untitled"}”. This cannot be undone.`}
        confirmLabel="delete note"
        busyLabel="deleting…"
        busy={deleting}
        error={deleteError}
        onConfirm={handleDelete}
        onCancel={cancelDelete}
      />
    </main>
  );
}
