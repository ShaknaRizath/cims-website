"use client";

import { useActionState } from "react";
import type { ActionState } from "@/lib/actions/action-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import { FileUploadField } from "@/components/admin/file-upload-field";

export interface PartnerUniversityFormDefaults {
  name: string;
  logoUrl: string | null;
  websiteUrl: string | null;
  orderIndex: number;
  isPublished: boolean;
}

export function PartnerUniversityForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  defaultValues?: PartnerUniversityFormDefaults;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, undefined);

  return (
    <form action={formAction}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input id="name" name="name" defaultValue={defaultValues?.name} placeholder="Liverpool John Moores University" required />
          <FieldError errors={state?.fieldErrors?.name?.map((message) => ({ message }))} />
        </Field>

        <Field>
          <FieldLabel htmlFor="websiteUrl">Website URL</FieldLabel>
          <Input
            id="websiteUrl"
            name="websiteUrl"
            type="url"
            defaultValue={defaultValues?.websiteUrl ?? ""}
            placeholder="https://www.ljmu.ac.uk"
          />
          <FieldError errors={state?.fieldErrors?.websiteUrl?.map((message) => ({ message }))} />
        </Field>

        <FileUploadField
          name="logoUrl"
          label="Logo"
          folder="cims-website/partners"
          defaultUrl={defaultValues?.logoUrl}
          disableCrop
          description="Uploaded as-is, no cropping — use the university's own logo file so nothing gets cut off."
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="orderIndex">Display order</FieldLabel>
            <Input id="orderIndex" name="orderIndex" type="number" defaultValue={defaultValues?.orderIndex ?? 0} />
          </Field>
          <div className="flex items-center">
            <label className="flex items-center gap-2 text-sm">
              <Checkbox name="isPublished" defaultChecked={defaultValues?.isPublished ?? true} />
              Published
            </label>
          </div>
        </div>

        {state?.error && <FieldError>{state.error}</FieldError>}
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : submitLabel}
        </Button>
      </FieldGroup>
    </form>
  );
}
