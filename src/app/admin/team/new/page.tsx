import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamMemberForm } from "@/components/admin/team-member-form";
import { createTeamMember } from "@/lib/actions/admin/team-member.actions";

export default function NewTeamMemberPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">New Team Member</h1>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Team member details</CardTitle>
        </CardHeader>
        <CardContent>
          <TeamMemberForm action={createTeamMember} submitLabel="Create team member" />
        </CardContent>
      </Card>
    </div>
  );
}
