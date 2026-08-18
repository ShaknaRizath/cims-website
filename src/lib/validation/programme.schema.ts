import { z } from "zod";
import { checkboxField, slugField, optionalTextField, optionalUrlField, bulletListField } from "@/lib/validation/shared";

export const programmeSchema = z.object({
  slug: slugField,
  name: z.string().min(2, { error: "Name must be at least 2 characters." }),
  categoryId: z.string().min(1, { error: "Select a category." }),
  level: optionalTextField,
  durationText: optionalTextField,
  summary: z.string().min(10, { error: "Summary must be at least 10 characters." }),
  description: z.string().min(10, { error: "Description must be at least 10 characters." }),
  entryRequirements: optionalTextField,
  careerOutcomes: optionalTextField,
  highlights: bulletListField,
  heroImageUrl: optionalUrlField,
  brochureFileUrl: optionalUrlField,
  isFeatured: checkboxField,
  isPublished: checkboxField,
  orderIndex: z.coerce.number().int().default(0),
});

export type ProgrammeInput = z.infer<typeof programmeSchema>;
