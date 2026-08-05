import { z } from "zod";
import { optionalTextField, optionalUrlField } from "@/lib/validation/shared";

export const campusSchema = z.object({
  name: z.string().min(2, { error: "Name must be at least 2 characters." }),
  addressLine1: z.string().min(2, { error: "Address is required." }),
  addressLine2: optionalTextField,
  city: z.string().min(2, { error: "City is required." }),
  phone: optionalTextField,
  email: z
    .string()
    .optional()
    .transform((value) => (value ? value : undefined))
    .refine((value) => !value || z.email().safeParse(value).success, {
      error: "Enter a valid email address.",
    }),
  mapEmbedUrl: optionalUrlField,
  photoUrl: optionalUrlField,
  orderIndex: z.coerce.number().int().default(0),
});

export type CampusInput = z.infer<typeof campusSchema>;
