import Link from "next/link";
import { Building2 } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

export default async function AdminCampusesPage() {
  const campuses = await prisma.campusLocation.findMany({ orderBy: { orderIndex: "asc" } });

  return (
    <div>
      <AdminPageHeader
        title="Campuses"
        description="Campus locations shown on the Contact page and footer."
        newLabel="New Campus"
        newHref="/admin/campuses/new"
      />
      {campuses.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Building2 />
            </EmptyMedia>
            <EmptyTitle>No campuses yet</EmptyTitle>
            <EmptyDescription>Campus locations you add will appear here.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campuses.map((campus) => (
              <TableRow key={campus.id}>
                <TableCell className="font-medium">
                  <Link href={`/admin/campuses/${campus.id}`} className="hover:underline">
                    {campus.name}
                  </Link>
                </TableCell>
                <TableCell>{campus.city}</TableCell>
                <TableCell>{campus.phone ?? "—"}</TableCell>
                <TableCell>{campus.email ?? "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
