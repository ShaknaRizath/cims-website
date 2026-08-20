import { requireAnyAdmin } from "@/lib/auth/rbac";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAnyAdmin();

  return (
    <AdminShell adminName={admin.name} adminEmail={admin.email} adminRole={admin.role}>
      {children}
    </AdminShell>
  );
}
