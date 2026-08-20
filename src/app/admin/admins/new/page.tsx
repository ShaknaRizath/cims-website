import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminUserForm } from "@/components/admin/admin-user-form";
import { createAdminUser } from "@/lib/actions/admin/admin-user.actions";

export default function NewAdminUserPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">New Admin User</h1>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Account details</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminUserForm action={createAdminUser} submitLabel="Create account" />
        </CardContent>
      </Card>
    </div>
  );
}
