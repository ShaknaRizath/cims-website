import Link from "next/link";
import Image from "next/image";
import { GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ProgrammeCardData {
  slug: string;
  name: string;
  category: string;
  level: string;
  durationText: string;
  summary: string;
  heroImageUrl?: string | null;
}

export function ProgrammeCard({ programme }: { programme: ProgrammeCardData }) {
  return (
    <Card className="group h-full gap-0 py-0 transition-shadow hover:shadow-lg">
      <Link href={`/programmes/${programme.slug}`} className="flex h-full flex-col">
        <div className="relative flex aspect-video items-center justify-center overflow-hidden bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
          {programme.heroImageUrl ? (
            <Image
              src={programme.heroImageUrl}
              alt=""
              fill
              unoptimized
              className="object-cover"
            />
          ) : (
            <GraduationCap className="size-10" />
          )}
        </div>
        <div className="flex flex-1 flex-col gap-3 p-6">
          <Badge variant="secondary" className="w-fit">
            {programme.category}
          </Badge>
          <h3 className="font-heading text-lg font-semibold text-foreground">
            {programme.name}
          </h3>
          <p className="line-clamp-2 flex-1 text-sm text-muted-foreground">
            {programme.summary}
          </p>
          <span className="text-sm text-muted-foreground">
            {programme.level} · {programme.durationText}
          </span>
          <span
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "w-full justify-center border-primary text-primary group-hover:bg-primary group-hover:text-primary-foreground",
            )}
          >
            Read More
          </span>
        </div>
      </Link>
    </Card>
  );
}
