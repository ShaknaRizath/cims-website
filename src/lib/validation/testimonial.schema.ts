import { z } from "zod";
import { checkboxField, optionalTextField, optionalUrlField } from "@/lib/validation/shared";

export const testimonialSchema = z.object({
  studentName: z.string().min(2, { error: "Name must be at least 2 characters." }),
  photoUrl: optionalUrlField,
  batchYear: z
    .string()
    .optional()
    .transform((value) => (value ? Number(value) : undefined)),
  programmeId: z
    .string()
    .optional()
    .transform((value) => (value && value !== "none" ? value : undefined)),
  // Free-text fallback used instead of programmeId when the programme isn't
  // in the dropdown — mutual exclusivity is enforced in the action, not here.
  programmeName: optionalTextField,
  quote: z.string().min(10, { error: "Quote must be at least 10 characters." }),
  videoUrl: optionalUrlField,
  isFeatured: checkboxField,
  isPublished: checkboxField,
  orderIndex: z.coerce.number().int().default(0),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;
