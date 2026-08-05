"use client";

import { useActionState } from "react";
import type { ActionState } from "@/lib/actions/action-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldGroup, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field";
import { FileUploadField } from "@/components/admin/file-upload-field";

const CATEGORY_OPTIONS = [
  { value: "ENGINEERING_TECHNOLOGY", label: "Engineering & Technology" },
  { value: "BUSINESS_ECONOMICS", label: "Business & Economics" },
  { value: "LAW_EDUCATION", label: "Law & Education" },
  { value: "STUDY_ABROAD", label: "Study Abroad" },
];

export interface ProgrammeFormDefaults {
  slug: string;
  name: string;
  category: string;
  level: string | null;
  durationText: string | null;
  summary: string;
  description: string;
  entryRequirements: string | null;
  careerOutcomes: string | null;
  highlights: unknown;
  heroImageUrl: string | null;
  brochureFileUrl: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  orderIndex: number;
}

export function ProgrammeForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  defaultValues?: ProgrammeFormDefaults;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, undefined);
  const highlightsText = Array.isArray(defaultValues?.highlights)
    ? (defaultValues.highlights as string[]).join("\n")
    : "";

  return (
    <form action={formAction}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Programme name</FieldLabel>
          <Input id="name" name="name" defaultValue={defaultValues?.name} required />
          <FieldError errors={state?.fieldErrors?.name?.map((message) => ({ message }))} />
        </Field>

        <Field>
          <FieldLabel htmlFor="slug">URL slug</FieldLabel>
          <Input id="slug" name="slug" defaultValue={defaultValues?.slug} placeholder="bsc-software-engineering" required />
          <FieldDescription>Used in the public URL: /programmes/your-slug</FieldDescription>
          <FieldError errors={state?.fieldErrors?.slug?.map((message) => ({ message }))} />
        </Field>

        <Field>
          <FieldLabel htmlFor="category">Category</FieldLabel>
          <Select name="category" defaultValue={defaultValues?.category ?? "ENGINEERING_TECHNOLOGY"} items={CATEGORY_OPTIONS}>
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
          <FieldError errors={state?.fieldErrors?.category?.map((message) => ({ message }))} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="level">Level</FieldLabel>
            <Input id="level" name="level" defaultValue={defaultValues?.level ?? ""} placeholder="Bachelor's Degree" />
          </Field>
          <Field>
            <FieldLabel htmlFor="durationText">Duration</FieldLabel>
            <Input id="durationText" name="durationText" defaultValue={defaultValues?.durationText ?? ""} placeholder="3 Years" />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="summary">Summary</FieldLabel>
          <Textarea id="summary" name="summary" defaultValue={defaultValues?.summary} rows={2} required />
          <FieldDescription>Short blurb shown on programme cards.</FieldDescription>
          <FieldError errors={state?.fieldErrors?.summary?.map((message) => ({ message }))} />
        </Field>

        <Field>
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <Textarea id="description" name="description" defaultValue={defaultValues?.description} rows={5} required />
          <FieldDescription>Full description shown on the programme detail page.</FieldDescription>
          <FieldError errors={state?.fieldErrors?.description?.map((message) => ({ message }))} />
        </Field>

        <Field>
          <FieldLabel htmlFor="entryRequirements">Entry requirements</FieldLabel>
          <Textarea id="entryRequirements" name="entryRequirements" defaultValue={defaultValues?.entryRequirements ?? ""} rows={3} />
        </Field>

        <Field>
          <FieldLabel htmlFor="careerOutcomes">Career outcomes</FieldLabel>
          <Textarea id="careerOutcomes" name="careerOutcomes" defaultValue={defaultValues?.careerOutcomes ?? ""} rows={3} />
        </Field>

        <Field>
          <FieldLabel htmlFor="highlights">Highlights</FieldLabel>
          <Textarea id="highlights" name="highlights" defaultValue={highlightsText} rows={4} placeholder={"Industry-aligned curriculum\nHands-on lab facilities\nInternship placements"} />
          <FieldDescription>One highlight per line — shown as bullet points.</FieldDescription>
        </Field>

        <FileUploadField
          name="heroImageUrl"
          label="Hero image"
          folder="programmes"
          defaultUrl={defaultValues?.heroImageUrl}
          accept="image/*"
        />

        <FileUploadField
          name="brochureFileUrl"
          label="Brochure (PDF)"
          folder="programmes"
          defaultUrl={defaultValues?.brochureFileUrl}
          accept="application/pdf"
          kind="file"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="orderIndex">Display order</FieldLabel>
            <Input id="orderIndex" name="orderIndex" type="number" defaultValue={defaultValues?.orderIndex ?? 0} />
          </Field>
          <div className="flex flex-col justify-center gap-3">
            <label className="flex items-center gap-2 text-sm">
              <Checkbox name="isFeatured" defaultChecked={defaultValues?.isFeatured} />
              Featured on homepage
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
