"use client";

import { useActionState } from "react";
import type { ActionState } from "@/lib/actions/action-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel, FieldGroup, FieldError } from "@/components/ui/field";
import { FileUploadField } from "@/components/admin/file-upload-field";

export interface HeroSlideFormDefaults {
  imageUrl: string;
  orderIndex: number;
  isPublished: boolean;
}

export function HeroSlideForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  defaultValues?: HeroSlideFormDefaults;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, undefined);

  return (
    <form action={formAction}>
      <FieldGroup>
        <FileUploadField
          name="imageUrl"
          label="Slide image"
          folder="cims-website/hero"
          defaultUrl={defaultValues?.imageUrl}
          errors={state?.fieldErrors?.imageUrl}
          aspectRatio={16 / 9}
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
