"use client";

import { useActionState } from "react";
import type { ActionState } from "@/lib/actions/action-state";
import { ADMIN_ROLE_LABELS } from "@/lib/format/labels";
import { AdminRole } from "@/generated/prisma/enums";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldGroup, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field";

const ROLE_OPTIONS = Object.values(AdminRole).map((value) => ({
  value,
  label: ADMIN_ROLE_LABELS[value],
}));

export function AdminUserForm({
  action,
  submitLabel,
}: {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, undefined);

  return (
    <form action={formAction}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input id="name" name="name" required />
          <FieldError errors={state?.fieldErrors?.name?.map((message) => ({ message }))} />
        </Field>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" name="email" type="email" required />
          <FieldError errors={state?.fieldErrors?.email?.map((message) => ({ message }))} />
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input id="password" name="password" type="password" required />
          <FieldDescription>At least 8 characters. Share this with them directly.</FieldDescription>
          <FieldError errors={state?.fieldErrors?.password?.map((message) => ({ message }))} />
        </Field>

        <Field>
          <FieldLabel htmlFor="role">Role</FieldLabel>
          <Select name="role" defaultValue="ADMISSIONS_OFFICER" items={ROLE_OPTIONS}>
            <SelectTrigger id="role" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROLE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldDescription>
            Administrators have full access. Admissions Officers can only view and update applications.
          </FieldDescription>
        </Field>

        {state?.error && <FieldError>{state.error}</FieldError>}
        <Button type="submit" disabled={pending}>
          {pending ? "Creating..." : submitLabel}
        </Button>
      </FieldGroup>
    </form>
  );
}
