"use client";

import { useActionState, useState } from "react";
import type { ActionState } from "@/lib/actions/action-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field";
import { FileUploadField } from "@/components/admin/file-upload-field";
import { EventCardImageField } from "@/components/admin/event-card-image-field";
import { toDatetimeLocalValue } from "@/lib/format/datetime-local";

export interface EventFormDefaults {
  slug: string;
  title: string;
  description: string | null;
  location: string | null;
  startAt: Date;
  endAt: Date | null;
  coverImageUrl: string | null;
  cardImageUrl: string | null;
  isFeatured: boolean;
  isPublished: boolean;
}

export function EventForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  defaultValues?: EventFormDefaults;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, undefined);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(defaultValues?.coverImageUrl ?? null);
  // Captured once — see news-post-form.tsx for why `new Date()` can't be computed inline here.
  const [now] = useState(() => new Date());

  return (
    <form action={formAction}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="title">Title</FieldLabel>
          <Input id="title" name="title" defaultValue={defaultValues?.title} required />
          <FieldError errors={state?.fieldErrors?.title?.map((message) => ({ message }))} />
        </Field>

        <Field>
          <FieldLabel htmlFor="slug">URL slug</FieldLabel>
          <Input id="slug" name="slug" defaultValue={defaultValues?.slug} placeholder="open-day-2026" required />
          <FieldDescription>Used in the public URL: /events/your-slug</FieldDescription>
          <FieldError errors={state?.fieldErrors?.slug?.map((message) => ({ message }))} />
        </Field>

        <Field>
          <FieldLabel htmlFor="location">Location</FieldLabel>
          <Input id="location" name="location" defaultValue={defaultValues?.location ?? ""} placeholder="CIMS Main Campus" />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="startAt">Starts</FieldLabel>
            <Input
              id="startAt"
              name="startAt"
              type="datetime-local"
              defaultValue={toDatetimeLocalValue(defaultValues?.startAt ?? now)}
              required
            />
            <FieldError errors={state?.fieldErrors?.startAt?.map((message) => ({ message }))} />
          </Field>
          <Field>
            <FieldLabel htmlFor="endAt">Ends (optional)</FieldLabel>
            <Input
              id="endAt"
              name="endAt"
              type="datetime-local"
              defaultValue={defaultValues?.endAt ? toDatetimeLocalValue(defaultValues.endAt) : ""}
            />
            <FieldError errors={state?.fieldErrors?.endAt?.map((message) => ({ message }))} />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <Textarea id="description" name="description" defaultValue={defaultValues?.description ?? ""} rows={5} />
        </Field>

        <FileUploadField
          name="coverImageUrl"
          label="Cover image"
          folder="events"
          defaultUrl={defaultValues?.coverImageUrl}
          onUploaded={setCoverImageUrl}
        />

        <EventCardImageField posterUrl={coverImageUrl} defaultUrl={defaultValues?.cardImageUrl} />

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm">
            <Checkbox name="isFeatured" defaultChecked={defaultValues?.isFeatured} />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox name="isPublished" defaultChecked={defaultValues?.isPublished ?? true} />
            Published
          </label>
        </div>

        {state?.error && <FieldError>{state.error}</FieldError>}
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : submitLabel}
        </Button>
      </FieldGroup>
    </form>
  );
}
