"use client";

import { useActionState, useRef, useState } from "react";
import type { ActionState } from "@/lib/actions/action-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldGroup, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field";
import { FileUploadField } from "@/components/admin/file-upload-field";
import { toDatetimeLocalValue } from "@/lib/format/datetime-local";
import { useFileUpload } from "@/lib/storage/use-file-upload";

const KIND_OPTIONS = [
  { value: "NEWS", label: "News" },
  { value: "ANNOUNCEMENT", label: "Announcement" },
];

const IMG_SRC_PATTERN = /<img[^>]+src="([^"]+)"/g;

function extractImageUrls(html: string): string[] {
  const urls: string[] = [];
  for (const match of html.matchAll(IMG_SRC_PATTERN)) {
    if (!urls.includes(match[1])) urls.push(match[1]);
  }
  return urls;
}

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

  const [bodyHtml, setBodyHtml] = useState(defaultValues?.bodyHtml ?? "");
  const [bodyImages, setBodyImages] = useState<string[]>(() => extractImageUrls(defaultValues?.bodyHtml ?? ""));
  const [coverSelection, setCoverSelection] = useState<string | undefined>(undefined);
  const bodyTextareaRef = useRef<HTMLTextAreaElement>(null);
  const { upload: uploadBodyImage, uploading: uploadingBodyImage, error: bodyImageUploadError } = useFileUpload();

  async function handleInsertImage(file: File) {
    const result = await uploadBodyImage(file, "cims-website/news");
    if (!result) return;

    const tag = `\n<img src="${result.url}" alt="" />\n`;
    const textarea = bodyTextareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart ?? bodyHtml.length;
      const end = textarea.selectionEnd ?? bodyHtml.length;
      setBodyHtml(bodyHtml.slice(0, start) + tag + bodyHtml.slice(end));
      requestAnimationFrame(() => {
        const cursor = start + tag.length;
        textarea.focus();
        textarea.setSelectionRange(cursor, cursor);
      });
    } else {
      setBodyHtml((prev) => prev + tag);
    }

    setBodyImages((prev) => (prev.includes(result.url) ? prev : [...prev, result.url]));
  }

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
          <Textarea
            id="bodyHtml"
            name="bodyHtml"
            ref={bodyTextareaRef}
            value={bodyHtml}
            onChange={(e) => setBodyHtml(e.target.value)}
            rows={8}
            required
          />
          <div className="flex items-center gap-3">
            <Input
              type="file"
              accept="image/*"
              disabled={uploadingBodyImage}
              className="max-w-xs"
              onChange={async (e) => {
                const selected = e.target.files?.[0];
                if (selected) await handleInsertImage(selected);
                e.target.value = "";
              }}
            />
            {uploadingBodyImage && <span className="text-sm text-muted-foreground">Uploading...</span>}
          </div>
          <FieldDescription>
            Add an image anywhere in the body by choosing a file above — it&apos;s inserted at your cursor.
            Basic formatting (paragraphs, bold, links, headings, lists) is also allowed.
          </FieldDescription>
          {bodyImageUploadError && <FieldError>{bodyImageUploadError}</FieldError>}
          <FieldError errors={state?.fieldErrors?.bodyHtml?.map((message) => ({ message }))} />
        </Field>

        <div>
          <FileUploadField
            name="coverImageUrl"
            label="Cover image"
            folder="cims-website/news"
            defaultUrl={defaultValues?.coverImageUrl}
            selectedUrl={coverSelection}
          />
          {bodyImages.length > 0 && (
            <div className="mt-3 flex flex-col gap-2">
              <FieldDescription>Or use one of the images already in the body:</FieldDescription>
              <div className="flex flex-wrap gap-2">
                {bodyImages.map((url) => (
                  <button
                    key={url}
                    type="button"
                    onClick={() => setCoverSelection(url)}
                    className="overflow-hidden rounded-lg border transition-colors hover:border-primary"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" className="size-16 object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

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
