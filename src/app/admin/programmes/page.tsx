import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

export default async function AdminProgrammesPage() {
  const programmes = await prisma.programme.findMany({
    orderBy: { orderIndex: "asc" },
    include: { categories: { select: { name: true }, orderBy: { orderIndex: "asc" } } },
  });

  return (
    <div>
      <AdminPageHeader
        title="Programmes"
        description="Degree and diploma programmes shown on the public site."
        newLabel="New Programme"
        newHref="/admin/programmes/new"
      />
      {programmes.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <GraduationCap />
            </EmptyMedia>
            <EmptyTitle>No programmes yet</EmptyTitle>
            <EmptyDescription>
              Programmes you add will appear here and on the public Programmes page.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {programmes.map((programme) => (
              <TableRow key={programme.id}>
                <TableCell className="font-medium">
                  <Link href={`/admin/programmes/${programme.id}`} className="hover:underline">
                    {programme.name}
                  </Link>
                </TableCell>
                <TableCell>{programme.categories.map((c) => c.name).join(", ")}</TableCell>
                <TableCell>{programme.level ?? "—"}</TableCell>
                <TableCell>
                  <Badge variant={programme.isPublished ? "secondary" : "outline"}>
                    {programme.isPublished ? "Published" : "Draft"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
