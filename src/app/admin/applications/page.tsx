import Link from "next/link";
import { FileText } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { APPLICATION_STATUS_LABELS } from "@/lib/format/labels";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

const STATUS_BADGE_VARIANT = {
  SUBMITTED: "secondary",
  UNDER_REVIEW: "outline",
  ACCEPTED: "default",
  REJECTED: "destructive",
} as const;

export default async function AdminApplicationsPage() {
  const applications = await prisma.application.findMany({
    orderBy: { createdAt: "desc" },
    include: { programme: { select: { name: true } } },
  });

  return (
    <div>
      <AdminPageHeader
        title="Applications"
        description="Online applications submitted through the Apply Now form."
      />
      {applications.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileText />
            </EmptyMedia>
            <EmptyTitle>No applications yet</EmptyTitle>
            <EmptyDescription>Submissions from the Apply Now form will appear here.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Applicant</TableHead>
              <TableHead>Programme</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((application) => (
              <TableRow key={application.id}>
                <TableCell className="font-medium">
                  <Link href={`/admin/applications/${application.id}`} className="hover:underline">
                    {application.fullName}
                  </Link>
                  <div className="text-sm text-muted-foreground">{application.email}</div>
                </TableCell>
                <TableCell>{application.programme.name}</TableCell>
                <TableCell>{application.createdAt.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant={STATUS_BADGE_VARIANT[application.status]}>
                    {APPLICATION_STATUS_LABELS[application.status]}
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
