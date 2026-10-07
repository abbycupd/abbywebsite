"use client";

import Link from "next/link";
import { Eye, EyeOff, ArrowUpCircle, Trash2 } from "lucide-react";
import type { JournalPost } from "@/lib/notes/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function relativeEdited(updatedAt: string, createdAt: string) {
  if (updatedAt === createdAt) return null;
  const minutes = (Date.now() - new Date(updatedAt).getTime()) / 60000;
  if (minutes < 60) return "edited recently";
  const hours = minutes / 60;
  if (hours < 24) return `edited ${Math.round(hours)}h ago`;
  return `edited ${Math.round(hours / 24)}d ago`;
}

export function PostRow({
  post,
  onPublish,
  onUnpublish,
  onDelete,
}: {
  post: JournalPost;
  onPublish: (id: string) => void;
  onUnpublish: (id: string) => void;
  onDelete: (post: JournalPost) => void;
}) {
  const isDraft = post.status === "draft";
  const editHref = `/admin/editor?id=${post.id}`;
  const previewHref = `/admin/preview?id=${post.id}`;
  const edited = relativeEdited(post.updated_at, post.created_at);

  return (
    <div className="flex flex-col gap-2 py-6 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
      <div className="flex-1">
        <Link href={editHref} className="group">
          <h3 className="font-display text-lg font-medium tracking-tight group-hover:text-roast">
            {post.title || "Untitled"}
          </h3>
        </Link>
        <p className="label mt-1">
          {isDraft ? formatDate(post.created_at) : formatDate(post.published_at ?? post.created_at)}
          {edited && <> · {edited}</>}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <Link href={editHref} className="label inline-flex items-center gap-1 hover:text-ink">
          {isDraft ? "continue writing" : "edit"} →
        </Link>
        <Link href={previewHref} title="Preview" className="text-graphite transition-colors hover:text-ink">
          <Eye size={16} />
        </Link>
        {isDraft ? (
          <button
            onClick={() => onPublish(post.id)}
            title="Publish"
            className="text-graphite transition-colors hover:text-roast"
          >
            <ArrowUpCircle size={16} />
          </button>
        ) : (
          <button
            onClick={() => onUnpublish(post.id)}
            title="Unpublish (return to draft)"
            className="text-graphite transition-colors hover:text-ink"
          >
            <EyeOff size={16} />
          </button>
        )}
        <button
          onClick={() => onDelete(post)}
          title="Delete"
          aria-label={`Delete “${post.title || "Untitled"}”`}
          className="text-graphite transition-colors hover:text-roast"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
