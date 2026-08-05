import type { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AdminPageHeaderProps {
  title: string;
  description: string;
  newLabel?: string;
  newHref?: string;
  action?: ReactNode;
}

export function AdminPageHeader({ title, description, newLabel, newHref, action }: AdminPageHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {action ??
        (newLabel && newHref && (
          <Button className="gap-2" nativeButton={false} render={<Link href={newHref} />}>
            <Plus className="size-4" /> {newLabel}
          </Button>
        ))}
    </div>
  );
}
