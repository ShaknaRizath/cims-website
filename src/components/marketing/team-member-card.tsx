import Image from "next/image";
import { UserRound } from "lucide-react";
import { Card } from "@/components/ui/card";

export interface TeamMemberCardData {
  name: string;
  title: string;
  bio?: string | null;
  photoUrl?: string | null;
}

export function TeamMemberCard({ member }: { member: TeamMemberCardData }) {
  return (
    <Card className="h-full items-center gap-3 p-6 text-center">
      <div className="relative flex size-20 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary">
        {member.photoUrl ? (
          <Image src={member.photoUrl} alt="" fill unoptimized className="object-cover" />
        ) : (
          <UserRound className="size-8" />
        )}
      </div>
      <div>
        <div className="font-heading font-semibold text-foreground">{member.name}</div>
        <div className="text-sm text-primary">{member.title}</div>
      </div>
      {member.bio && <p className="whitespace-pre-line text-sm text-muted-foreground">{member.bio}</p>}
    </Card>
  );
}
