import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

export default async function AdminCertificateVerificationRequestsPage() {
  const requests = await prisma.certificateVerificationRequest.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <AdminPageHeader
        title="Certificate Verification Requests"
        description="Requests submitted through the Certificate Verification page."
      />
      {requests.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ShieldCheck />
            </EmptyMedia>
            <EmptyTitle>No requests yet</EmptyTitle>
            <EmptyDescription>Certificate verification requests will appear here.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Verifier</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Certificate #</TableHead>
              <TableHead>Received</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">
                  <Link href={`/admin/certificate-verification-requests/${request.id}`} className="hover:underline">
                    {request.verifierName}
                  </Link>
                  <div className="text-sm text-muted-foreground">{request.verifierInstitution}</div>
                </TableCell>
                <TableCell>{request.studentName}</TableCell>
                <TableCell>{request.certificateNumber}</TableCell>
                <TableCell>{request.createdAt.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant={request.isRead ? "outline" : "secondary"}>
                    {request.isRead ? "Read" : "New"}
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
