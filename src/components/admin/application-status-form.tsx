"use client";

import { useActionState } from "react";
import { updateApplicationStatus } from "@/lib/actions/admin/application.actions";
import { APPLICATION_STATUS_LABELS } from "@/lib/format/labels";
import { ApplicationStatus } from "@/generated/prisma/enums";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ActionState } from "@/lib/actions/action-state";

const STATUS_OPTIONS = Object.values(ApplicationStatus).map((value) => ({
  value,
  label: APPLICATION_STATUS_LABELS[value],
}));

export function ApplicationStatusForm({
  applicationId,
  status,
}: {
  applicationId: string;
  status: ApplicationStatus;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    updateApplicationStatus.bind(null, applicationId),
    undefined,
  );

  return (
    <form action={formAction} className="flex items-center gap-2">
      <Select key={status} name="status" defaultValue={status} items={STATUS_OPTIONS}>
        <SelectTrigger className="w-44">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="submit" variant="outline" disabled={pending}>
        {pending ? "Updating..." : "Update Status"}
      </Button>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
    </form>
  );
}
