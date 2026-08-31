"use client";

import { useActionState } from "react";
import type { ActionState } from "@/lib/actions/action-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import { FileUploadField } from "@/components/admin/file-upload-field";

const CATEGORY_OPTIONS = [
  { value: "BOARD_OF_GOVERNORS", label: "Board of Governors" },
  { value: "ACADEMIC_BOARD", label: "Academic Board" },
  { value: "INTERNATIONAL_REPRESENTATIVE", label: "International Representative" },
  { value: "ACADEMIC_PANEL", label: "Academic Panel" },
];

export interface TeamMemberFormDefaults {
  name: string;
  category: string;
  title: string;
  bio: string | null;
  photoUrl: string | null;
  orderIndex: number;
  isPublished: boolean;
}

export function TeamMemberForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  defaultValues?: TeamMemberFormDefaults;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, undefined);

  return (
    <form action={formAction}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input id="name" name="name" defaultValue={defaultValues?.name} required />
          <FieldError errors={state?.fieldErrors?.name?.map((message) => ({ message }))} />
        </Field>

        <Field>
          <FieldLabel htmlFor="title">Title / position</FieldLabel>
          <Input id="title" name="title" defaultValue={defaultValues?.title} placeholder="Chairman" required />
          <FieldError errors={state?.fieldErrors?.title?.map((message) => ({ message }))} />
        </Field>

        <Field>
          <FieldLabel htmlFor="category">Category</FieldLabel>
          <Select name="category" defaultValue={defaultValues?.category ?? "BOARD_OF_GOVERNORS"} items={CATEGORY_OPTIONS}>
            <SelectTrigger id="category" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel htmlFor="bio">Bio</FieldLabel>
          <Textarea id="bio" name="bio" defaultValue={defaultValues?.bio ?? ""} rows={4} />
        </Field>

        <FileUploadField
          name="photoUrl"
          label="Photo"
          folder="cims-website/team"
          defaultUrl={defaultValues?.photoUrl}
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
