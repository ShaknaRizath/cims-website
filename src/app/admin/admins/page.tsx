import { UserCog } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { ADMIN_ROLE_LABELS } from "@/lib/format/labels";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import { AdminUserToggleButton } from "@/components/admin/admin-user-toggle-button";

export default async function AdminUsersPage() {
  const admins = await prisma.adminUser.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div>
      <AdminPageHeader
        title="Admin Users"
        description="Manage who can sign in to the CIMS admin area."
        newLabel="New Admin User"
        newHref="/admin/admins/new"
      />
      {admins.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <UserCog />
            </EmptyMedia>
            <EmptyTitle>No admin users yet</EmptyTitle>
            <EmptyDescription>Create the first admin account to get started.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell className="font-medium">
                  {admin.name}
                  <div className="text-sm text-muted-foreground">{admin.email}</div>
                </TableCell>
                <TableCell>{ADMIN_ROLE_LABELS[admin.role]}</TableCell>
                <TableCell>
                  <Badge variant={admin.isActive ? "outline" : "secondary"}>
                    {admin.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <AdminUserToggleButton adminId={admin.id} isActive={admin.isActive} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
