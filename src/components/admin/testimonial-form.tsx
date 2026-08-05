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

export interface TestimonialFormDefaults {
  studentName: string;
  photoUrl: string | null;
  batchYear: number | null;
  programmeId: string | null;
  quote: string;
  videoUrl: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  orderIndex: number;
}

export function TestimonialForm({
  action,
  defaultValues,
  submitLabel,
  programmes,
}: {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  defaultValues?: TestimonialFormDefaults;
  submitLabel: string;
  programmes: { id: string; name: string }[];
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, undefined);
  const programmeOptions = [{ value: "none", label: "None" }, ...programmes.map((p) => ({ value: p.id, label: p.name }))];

  return (
    <form action={formAction}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="studentName">Student name</FieldLabel>
          <Input id="studentName" name="studentName" defaultValue={defaultValues?.studentName} required />
          <FieldError errors={state?.fieldErrors?.studentName?.map((message) => ({ message }))} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="batchYear">Batch year</FieldLabel>
            <Input id="batchYear" name="batchYear" type="number" defaultValue={defaultValues?.batchYear ?? ""} placeholder="2026" />
          </Field>
          <Field>
            <FieldLabel htmlFor="programmeId">Programme</FieldLabel>
            <Select name="programmeId" defaultValue={defaultValues?.programmeId ?? "none"} items={programmeOptions}>
              <SelectTrigger id="programmeId" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {programmeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="quote">Quote</FieldLabel>
          <Textarea id="quote" name="quote" defaultValue={defaultValues?.quote} rows={4} required />
          <FieldError errors={state?.fieldErrors?.quote?.map((message) => ({ message }))} />
        </Field>

        <Field>
          <FieldLabel htmlFor="videoUrl">Video URL (optional)</FieldLabel>
          <Input id="videoUrl" name="videoUrl" defaultValue={defaultValues?.videoUrl ?? ""} placeholder="https://youtube.com/..." />
        </Field>

        <FileUploadField
          name="photoUrl"
          label="Photo"
          folder="testimonials"
          defaultUrl={defaultValues?.photoUrl}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="orderIndex">Display order</FieldLabel>
            <Input id="orderIndex" name="orderIndex" type="number" defaultValue={defaultValues?.orderIndex ?? 0} />
          </Field>
          <div className="flex flex-col justify-center gap-3">
            <label className="flex items-center gap-2 text-sm">
              <Checkbox name="isFeatured" defaultChecked={defaultValues?.isFeatured} />
              Featured
            </label>
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
