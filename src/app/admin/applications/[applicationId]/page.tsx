import { notFound } from "next/navigation";
import { FileText, Mail, Phone } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { DOCUMENT_SLOTS } from "@/lib/validation/application.schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeleteConfirmButton } from "@/components/admin/delete-confirm-button";
import { ApplicationStatusForm } from "@/components/admin/application-status-form";
import { deleteApplication } from "@/lib/actions/admin/application.actions";

function DetailRow({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div className="flex flex-col gap-0.5 py-2 text-sm sm:flex-row sm:items-center sm:justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground sm:text-right">{value || "—"}</span>
    </div>
  );
}

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) {
  const { applicationId } = await params;

  const [session, application] = await Promise.all([
    auth(),
    prisma.application.findUnique({
      where: { id: applicationId },
      include: { programme: { select: { name: true } }, documents: true },
    }),
  ]);
  if (!application) notFound();
  const canDelete = session?.user?.role === "ADMIN";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">{application.fullName}</h1>
          <div className="mt-1 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <a href={`mailto:${application.email}`} className="flex items-center gap-1.5 hover:text-primary">
              <Mail className="size-4" /> {application.email}
            </a>
            <a href={`tel:${application.mobileNumber}`} className="flex items-center gap-1.5 hover:text-primary">
              <Phone className="size-4" /> {application.mobileNumber}
            </a>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ApplicationStatusForm applicationId={application.id} status={application.status} />
          {canDelete && (
            <DeleteConfirmButton
              action={deleteApplication.bind(null, application.id)}
              title="Delete this application?"
              description="This permanently deletes the application and its uploaded documents' records. This cannot be undone."
            />
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Student Details</CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            <DetailRow label="Full Name" value={application.fullName} />
            <DetailRow label="Name with Initials" value={application.nameWithInitials} />
            <DetailRow label="Date of Birth" value={application.dateOfBirth.toLocaleDateString()} />
            <DetailRow label="Gender" value={application.gender === "MALE" ? "Male" : "Female"} />
            <DetailRow label="NIC / Passport" value={application.nicOrPassport} />
            <DetailRow label="Nationality" value={application.nationality} />
            <DetailRow label="Address" value={application.address} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Programme & Qualifications</CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            <DetailRow label="Programme" value={application.programme.name} />
            <DetailRow label="Highest Qualification" value={application.highestQualification} />
            <DetailRow label="Institution" value={application.institution} />
            <DetailRow label="Year Completed" value={application.yearCompleted} />
            <DetailRow label="Additional Qualifications" value={application.additionalQualifications} />
            <DetailRow label="Submitted" value={application.createdAt.toLocaleString()} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {DOCUMENT_SLOTS.map((slot) => {
            const files = application.documents.filter((doc) => doc.documentType === slot.key);
            return (
              <div key={slot.key} className="flex flex-col gap-1.5 py-1.5 text-sm">
                <span className="text-muted-foreground">{slot.label}</span>
                {files.length === 0 ? (
                  <span className="text-foreground">Not provided</span>
                ) : (
                  <div className="flex flex-col gap-1">
                    {files.map((file) => (
                      <a
                        key={file.id}
                        href={file.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex w-fit items-center gap-1.5 text-primary hover:underline"
                      >
                        <FileText className="size-3.5 shrink-0" /> {file.fileName}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
