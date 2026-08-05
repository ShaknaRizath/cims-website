import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamMemberForm } from "@/components/admin/team-member-form";
import { DeleteConfirmButton } from "@/components/admin/delete-confirm-button";
import { updateTeamMember, deleteTeamMember } from "@/lib/actions/admin/team-member.actions";

export default async function TeamMemberDetailPage({
  params,
}: {
  params: Promise<{ memberId: string }>;
}) {
  const { memberId } = await params;

  const member = await prisma.teamMember.findUnique({ where: { id: memberId } });
  if (!member) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-foreground">{member.name}</h1>
        <DeleteConfirmButton
          action={deleteTeamMember.bind(null, member.id)}
          title={`Delete ${member.name}?`}
          description="This permanently deletes the team member. This cannot be undone."
        />
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Edit team member</CardTitle>
        </CardHeader>
        <CardContent>
          <TeamMemberForm
            action={updateTeamMember.bind(null, member.id)}
            defaultValues={member}
            submitLabel="Save changes"
          />
        </CardContent>
      </Card>
    </div>
  );
}
