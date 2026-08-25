"use client";

import { useActionState } from "react";
import type { ActionState } from "@/lib/actions/action-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldGroup, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field";
import { FileUploadField } from "@/components/admin/file-upload-field";

export interface CampusFormDefaults {
  name: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  phone: string | null;
  email: string | null;
  mapEmbedUrl: string | null;
  photoUrl: string | null;
  orderIndex: number;
}

export function CampusForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  defaultValues?: CampusFormDefaults;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, undefined);

  return (
    <form action={formAction}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Campus name</FieldLabel>
          <Input id="name" name="name" defaultValue={defaultValues?.name} placeholder="CIMS Main Campus" required />
          <FieldError errors={state?.fieldErrors?.name?.map((message) => ({ message }))} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="addressLine1">Address line 1</FieldLabel>
            <Input id="addressLine1" name="addressLine1" defaultValue={defaultValues?.addressLine1} required />
            <FieldError errors={state?.fieldErrors?.addressLine1?.map((message) => ({ message }))} />
          </Field>
          <Field>
            <FieldLabel htmlFor="addressLine2">Address line 2</FieldLabel>
            <Input id="addressLine2" name="addressLine2" defaultValue={defaultValues?.addressLine2 ?? ""} />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="city">City</FieldLabel>
          <Input id="city" name="city" defaultValue={defaultValues?.city} required />
          <FieldError errors={state?.fieldErrors?.city?.map((message) => ({ message }))} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="phone">Phone</FieldLabel>
            <Input id="phone" name="phone" defaultValue={defaultValues?.phone ?? ""} />
          </Field>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input id="email" name="email" type="email" defaultValue={defaultValues?.email ?? ""} />
            <FieldError errors={state?.fieldErrors?.email?.map((message) => ({ message }))} />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="mapEmbedUrl">Google Maps embed URL</FieldLabel>
          <Textarea id="mapEmbedUrl" name="mapEmbedUrl" defaultValue={defaultValues?.mapEmbedUrl ?? ""} rows={2} />
          <FieldDescription>Paste the &quot;src&quot; URL from a Google Maps embed iframe.</FieldDescription>
        </Field>

        <FileUploadField
          name="photoUrl"
          label="Photo"
          folder="cims-website/campuses"
          defaultUrl={defaultValues?.photoUrl}
        />

        <Field>
          <FieldLabel htmlFor="orderIndex">Display order</FieldLabel>
          <Input id="orderIndex" name="orderIndex" type="number" defaultValue={defaultValues?.orderIndex ?? 0} />
        </Field>

        {state?.error && <FieldError>{state.error}</FieldError>}
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : submitLabel}
        </Button>
      </FieldGroup>
    </form>
  );
}
