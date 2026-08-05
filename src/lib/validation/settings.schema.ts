import { z } from "zod";
import { optionalTextField, optionalUrlField } from "@/lib/validation/shared";

export const siteSettingsSchema = z.object({
  heroHeadline: z.string().min(2, { error: "Hero headline is required." }),
  heroSubheadline: optionalTextField,
  heroImageUrl: optionalUrlField,
  aboutSummary: optionalTextField,
  chairmanMessageHtml: optionalTextField,
  chairmanPhotoUrl: optionalUrlField,
  contactPhone: z.string().min(2, { error: "Contact phone is required." }),
  contactEmail: z.email({ error: "Enter a valid email address." }),
  contactAddress: z.string().min(2, { error: "Contact address is required." }),
  whatsappNumber: optionalTextField,
  facebookUrl: optionalUrlField,
  instagramUrl: optionalUrlField,
  linkedinUrl: optionalUrlField,
  youtubeUrl: optionalUrlField,
  tiktokUrl: optionalUrlField,
  lmsUrl: z.url({ error: "Enter a valid URL." }),
  certificateVerifyUrl: z.url({ error: "Enter a valid URL." }),
  onlinePaymentUrl: z.url({ error: "Enter a valid URL." }),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
