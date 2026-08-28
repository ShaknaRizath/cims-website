import { notFound } from "next/navigation";
import { Mail, Phone } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeleteConfirmButton } from "@/components/admin/delete-confirm-button";
import { deleteCertificateVerificationRequest } from "@/lib/actions/admin/certificate-verification.actions";

export default async function CertificateVerificationRequestDetailPage({
  params,
}: {
  params: Promise<{ requestId: string }>;
}) {
  const { requestId } = await params;

  const request = await prisma.certificateVerificationRequest.findUnique({ where: { id: requestId } });
  if (!request) notFound();

  if (!request.isRead) {
    await prisma.certificateVerificationRequest.update({ where: { id: requestId }, data: { isRead: true } });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Verification request for {request.studentName}
        </h1>
        <DeleteConfirmButton
          action={deleteCertificateVerificationRequest.bind(null, request.id)}
          title="Delete this request?"
          description="This permanently deletes the verification request. This cannot be undone."
        />
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Verifier</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-1 text-sm text-foreground">
            <span>
              <span className="text-muted-foreground">Name: </span>
              {request.verifierName}
            </span>
            <span>
              <span className="text-muted-foreground">Institution: </span>
              {request.verifierInstitution}
            </span>
            <span>
              <span className="text-muted-foreground">Department: </span>
              {request.verifierDepartment}
            </span>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <a href={`mailto:${request.verifierEmail}`} className="flex items-center gap-1.5 hover:text-primary">
              <Mail className="size-4" /> {request.verifierEmail}
            </a>
            <a href={`tel:${request.verifierMobile}`} className="flex items-center gap-1.5 hover:text-primary">
              <Phone className="size-4" /> {request.verifierMobile}
            </a>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Purpose</p>
            <p className="whitespace-pre-wrap text-foreground">{request.purpose}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Student Detail</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm text-foreground">
          <span>
            <span className="text-muted-foreground">Name: </span>
            {request.studentName}
          </span>
          <span>
            <span className="text-muted-foreground">Certificate Number: </span>
            {request.certificateNumber}
          </span>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">Received {request.createdAt.toLocaleString()}</p>
    </div>
  );
}
