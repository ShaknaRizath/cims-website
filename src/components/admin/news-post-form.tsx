"use client";

import { useActionState, useState } from "react";
import type { ActionState } from "@/lib/actions/action-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldGroup, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field";
import { FileUploadField } from "@/components/admin/file-upload-field";
import { toDatetimeLocalValue } from "@/lib/format/datetime-local";

const KIND_OPTIONS = [
  { value: "NEWS", label: "News" },
  { value: "ANNOUNCEMENT", label: "Announcement" },
];

export interface NewsPostFormDefaults {
  slug: string;
  kind: string;
  title: string;
  excerpt: string | null;
  bodyHtml: string;
  coverImageUrl: string | null;
  isPinned: boolean;
  isPublished: boolean;
  publishedAt: Date;
}

export function NewsPostForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  defaultValues?: NewsPostFormDefaults;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, undefined);
  // Captured once — `new Date()` inline in defaultValue would recompute a
  // different value on every re-render, which is what triggered Base UI's
  // "uncontrolled FieldControl default value changed after init" warning.
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
          <Input id="slug" name="slug" defaultValue={defaultValues?.slug} placeholder="cims-graduation-2026" required />
          <FieldDescription>Used in the public URL: /news/your-slug</FieldDescription>
          <FieldError errors={state?.fieldErrors?.slug?.map((message) => ({ message }))} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="kind">Type</FieldLabel>
            <Select name="kind" defaultValue={defaultValues?.kind ?? "NEWS"} items={KIND_OPTIONS}>
              <SelectTrigger id="kind" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {KIND_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="publishedAt">Published date</FieldLabel>
            <Input
              id="publishedAt"
              name="publishedAt"
              type="datetime-local"
              defaultValue={toDatetimeLocalValue(defaultValues?.publishedAt ?? now)}
              required
            />
            <FieldError errors={state?.fieldErrors?.publishedAt?.map((message) => ({ message }))} />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="excerpt">Excerpt</FieldLabel>
          <Textarea id="excerpt" name="excerpt" defaultValue={defaultValues?.excerpt ?? ""} rows={2} />
          <FieldDescription>Short summary shown in listing cards.</FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="bodyHtml">Body</FieldLabel>
          <Textarea id="bodyHtml" name="bodyHtml" defaultValue={defaultValues?.bodyHtml} rows={8} required />
          <FieldError errors={state?.fieldErrors?.bodyHtml?.map((message) => ({ message }))} />
        </Field>

        <FileUploadField
          name="coverImageUrl"
          label="Cover image"
          folder="cims-website/news"
          defaultUrl={defaultValues?.coverImageUrl}
        />

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm">
            <Checkbox name="isPinned" defaultChecked={defaultValues?.isPinned} />
            Pinned
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
