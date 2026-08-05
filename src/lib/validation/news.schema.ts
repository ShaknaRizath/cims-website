import { z } from "zod";
import { PostKind } from "@/generated/prisma/enums";
import { checkboxField, slugField, optionalTextField, optionalUrlField } from "@/lib/validation/shared";

export const newsPostSchema = z.object({
  slug: slugField,
  kind: z.enum(PostKind),
  title: z.string().min(2, { error: "Title must be at least 2 characters." }),
  excerpt: optionalTextField,
  bodyHtml: z.string().min(10, { error: "Body must be at least 10 characters." }),
  coverImageUrl: optionalUrlField,
  isPinned: checkboxField,
  isPublished: checkboxField,
  publishedAt: z.coerce.date(),
});

export type NewsPostInput = z.infer<typeof newsPostSchema>;
