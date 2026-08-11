import { z } from "zod";
import { checkboxField, optionalUrlField } from "@/lib/validation/shared";

export const partnerUniversitySchema = z.object({
  name: z.string().min(2, { error: "Name must be at least 2 characters." }),
  logoUrl: optionalUrlField,
  websiteUrl: optionalUrlField,
  orderIndex: z.coerce.number().int().default(0),
  isPublished: checkboxField,
});

export type PartnerUniversityInput = z.infer<typeof partnerUniversitySchema>;
