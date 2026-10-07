"use client";

import { AdminGuard } from "@/components/admin/admin-guard";
import { Dashboard } from "@/components/admin/dashboard";

export default function AdminPage() {
  return (
    <AdminGuard>
      <Dashboard />
    </AdminGuard>
  );
}
