import { requireAdmin } from "@/lib/auth/rbac";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();

  return (
    <AdminShell adminName={admin.name} adminEmail={admin.email}>
      {children}
    </AdminShell>
  );
}
