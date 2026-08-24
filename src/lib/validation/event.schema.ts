import { z } from "zod";
import { checkboxField, slugField, optionalTextField, optionalUrlField } from "@/lib/validation/shared";

export const eventSchema = z
  .object({
    slug: slugField,
    title: z.string().min(2, { error: "Title must be at least 2 characters." }),
    description: optionalTextField,
    location: optionalTextField,
    startAt: z.coerce.date({ error: "Enter a valid start date/time." }),
    endAt: z
      .string()
      .optional()
      .transform((value) => (value ? new Date(value) : undefined)),
    coverImageUrl: optionalUrlField,
    cardImageUrl: optionalUrlField,
    isFeatured: checkboxField,
    isPublished: checkboxField,
  })
  .refine((data) => !data.endAt || data.endAt >= data.startAt, {
    error: "End date must be on or after the start date.",
    path: ["endAt"],
  });

export type EventInput = z.infer<typeof eventSchema>;
