"use client";

import { useActionState } from "react";
import { toggleAdminUserActive } from "@/lib/actions/admin/admin-user.actions";
import { Button } from "@/components/ui/button";
import type { ActionState } from "@/lib/actions/action-state";

export function AdminUserToggleButton({ adminId, isActive }: { adminId: string; isActive: boolean }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    toggleAdminUserActive.bind(null, adminId),
    undefined,
  );

  return (
    <form action={formAction} className="flex items-center justify-end gap-2">
      {state?.error && <span className="text-xs text-destructive">{state.error}</span>}
      <Button type="submit" variant="outline" size="sm" disabled={pending}>
        {pending ? "Updating..." : isActive ? "Deactivate" : "Activate"}
      </Button>
    </form>
  );
}
