import Link from "next/link";
import { Users } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

export default async function AdminTeamPage() {
  const members = await prisma.teamMember.findMany({
    orderBy: [{ category: "asc" }, { orderIndex: "asc" }],
  });

  return (
    <div>
      <AdminPageHeader
        title="Team"
        description="Board of Governors, Academic Board, Academic Panel, and International Representatives shown on the Team page."
        newLabel="New Team Member"
        newHref="/admin/team/new"
      />
      {members.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Users />
            </EmptyMedia>
            <EmptyTitle>No team members yet</EmptyTitle>
            <EmptyDescription>Team members you add will appear here and on the public Team page.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">
                  <Link href={`/admin/team/${member.id}`} className="hover:underline">
                    {member.name}
                  </Link>
                </TableCell>
                <TableCell>{member.title}</TableCell>
                <TableCell>{member.category.replaceAll("_", " ")}</TableCell>
                <TableCell>
                  <Badge variant={member.isPublished ? "secondary" : "outline"}>
                    {member.isPublished ? "Published" : "Draft"}
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
