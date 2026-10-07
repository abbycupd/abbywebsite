"use client";

import { useEffect, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Quote,
  List,
  ListOrdered,
  ImagePlus,
} from "lucide-react";
import { uploadJournalImage } from "@/lib/notes/admin-queries";
import { toFriendlyError } from "@/lib/notes/errors";
import type { JournalDoc } from "@/lib/notes/types";

// Defined once, outside the component: useEditor compares its options on
// every render and calls editor.setOptions() if anything differs. New
// extension/editorProps objects each render made that happen on every
// keystroke, which re-entered ProseMirror mid-typing and could loop until
// React threw "Maximum update depth exceeded".
const EXTENSIONS = [
  StarterKit.configure({
    code: false,
    codeBlock: false,
    strike: false,
    underline: false,
    horizontalRule: false,
    link: {
      openOnClick: false,
      autolink: true,
      HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
    },
  }),
  Image,
  Placeholder.configure({ placeholder: "Start writing…" }),
];

const EDITOR_PROPS = {
  attributes: { class: "journal-editor-content" },
};

function ToolbarButton({
  onClick,
  active,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={`rounded-md p-1.5 transition-colors ${
        active ? "bg-ink text-cream" : "text-graphite hover:bg-mist/60 hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({
  content,
  onChange,
  onUploadError,
}: {
  content: JournalDoc;
  onChange: (doc: JournalDoc) => void;
  onUploadError: (message: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Only the first `content` seeds the editor (kept stable for the same
  // reason as EXTENSIONS); later outside replacements go through the sync
  // effect below.
  const [initialContent] = useState(content);

  // Every doc the editor itself produced (or has already been given), so the
  // parent echoing one back as `content` is never mistaken for an outside
  // replacement and re-applied over newer typing.
  const knownDocsRef = useRef(new WeakSet<JournalDoc>([initialContent]));

  // Report changes to the parent at most once per animation frame. ProseMirror
  // calls onUpdate from inside the keystroke's DOM-mutation handling, and a
  // synchronous parent setState there is urgent (sync-lane) work; a fast
  // burst of keystrokes could chain enough of those to trip React's
  // "Maximum update depth exceeded". Batching per frame makes each burst one
  // ordinary update, at most ~16ms behind the editor.
  const pendingDocRef = useRef<JournalDoc | null>(null);
  const frameRef = useRef<number | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  useEffect(() => () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
  }, []);

  const editor = useEditor({
    extensions: EXTENSIONS,
    content: initialContent as unknown as Record<string, unknown>,
    editorProps: EDITOR_PROPS,
    onUpdate: ({ editor }) => {
      const doc = editor.getJSON() as unknown as JournalDoc;
      knownDocsRef.current.add(doc);
      pendingDocRef.current = doc;
      if (frameRef.current !== null) return;
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null;
        const latest = pendingDocRef.current;
        pendingDocRef.current = null;
        if (latest) onChangeRef.current(latest);
      });
    },
  });

  // Keep the editor in sync if `content` is replaced from outside (e.g.
  // loading a different post), without fighting the user's own typing.
  useEffect(() => {
    if (!editor || knownDocsRef.current.has(content)) return;
    editor.commands.setContent(content as unknown as Record<string, unknown>, { emitUpdate: false });
    knownDocsRef.current.add(content);
  }, [content, editor]);

  if (!editor) return null;

  function toggleLink() {
    if (editor.isActive("link")) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    const url = window.prompt("Link URL:");
    if (!url) return;
    editor.chain().focus().setLink({ href: url }).run();
  }

  async function handleImageSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const url = await uploadJournalImage(file, "inline");
      editor.chain().focus().setImage({ src: url, alt: "" }).run();
    } catch (err) {
      onUploadError(toFriendlyError(err, "Couldn't upload image"));
    }
  }

  return (
    <div className="rounded-md border border-mist">
      <div className="flex flex-wrap items-center gap-1 border-b border-mist p-2">
        <ToolbarButton label="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton label="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic size={16} />
        </ToolbarButton>
        <ToolbarButton
          label="Heading"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 size={16} />
        </ToolbarButton>
        <ToolbarButton
          label="Subheading"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 size={16} />
        </ToolbarButton>
        <ToolbarButton label="Link" active={editor.isActive("link")} onClick={toggleLink}>
          <LinkIcon size={16} />
        </ToolbarButton>
        <ToolbarButton label="Quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote size={16} />
        </ToolbarButton>
        <ToolbarButton label="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton
          label="Numbered list"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={16} />
        </ToolbarButton>
        <ToolbarButton label="Insert image" onClick={() => fileInputRef.current?.click()}>
          <ImagePlus size={16} />
        </ToolbarButton>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelected} />
      </div>
      <div className="px-4 py-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
