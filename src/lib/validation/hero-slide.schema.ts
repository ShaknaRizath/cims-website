import { z } from "zod";
import { checkboxField } from "@/lib/validation/shared";

export const heroSlideSchema = z.object({
  imageUrl: z.string().min(1, { error: "An image is required." }),
  orderIndex: z.coerce.number().int().default(0),
  isPublished: checkboxField,
});

export type HeroSlideInput = z.infer<typeof heroSlideSchema>;
