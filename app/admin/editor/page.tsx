"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AdminGuard } from "@/components/admin/admin-guard";
import { PostEditor } from "@/components/admin/editor/post-editor";

function EditorRoute() {
  const id = useSearchParams().get("id") ?? undefined;
  return (
    <AdminGuard>
      <PostEditor id={id} />
    </AdminGuard>
  );
}

export default function AdminEditorPage() {
  return (
    <Suspense fallback={null}>
      <EditorRoute />
    </Suspense>
  );
}
