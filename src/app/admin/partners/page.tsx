import Link from "next/link";
import { Landmark } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

export default async function AdminPartnersPage() {
  const partners = await prisma.partnerUniversity.findMany({
    orderBy: [{ orderIndex: "asc" }],
  });

  return (
    <div>
      <AdminPageHeader
        title="Partner Universities"
        description="Partner institutions shown in the logo strip on the homepage."
        newLabel="New Partner University"
        newHref="/admin/partners/new"
      />
      {partners.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Landmark />
            </EmptyMedia>
            <EmptyTitle>No partner universities yet</EmptyTitle>
            <EmptyDescription>Partners you add will appear here and on the homepage.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Website</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {partners.map((partner) => (
              <TableRow key={partner.id}>
                <TableCell className="font-medium">
                  <Link href={`/admin/partners/${partner.id}`} className="hover:underline">
                    {partner.name}
                  </Link>
                </TableCell>
                <TableCell>{partner.websiteUrl ?? "—"}</TableCell>
                <TableCell>
                  <Badge variant={partner.isPublished ? "secondary" : "outline"}>
                    {partner.isPublished ? "Published" : "Draft"}
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
