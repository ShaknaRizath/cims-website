import { z } from "zod";
import { TeamCategory } from "@/generated/prisma/enums";
import { checkboxField, optionalTextField, optionalUrlField } from "@/lib/validation/shared";

export const teamMemberSchema = z.object({
  name: z.string().min(2, { error: "Name must be at least 2 characters." }),
  category: z.enum(TeamCategory),
  title: z.string().min(2, { error: "Title must be at least 2 characters." }),
  bio: optionalTextField,
  photoUrl: optionalUrlField,
  orderIndex: z.coerce.number().int().default(0),
  isPublished: checkboxField,
});

export type TeamMemberInput = z.infer<typeof teamMemberSchema>;
