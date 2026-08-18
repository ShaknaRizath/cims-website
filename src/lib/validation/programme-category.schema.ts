import { z } from "zod";

export const programmeCategorySchema = z.object({
  name: z.string().min(2, { error: "Name must be at least 2 characters." }),
  orderIndex: z.coerce.number().int().default(0),
});

export type ProgrammeCategoryInput = z.infer<typeof programmeCategorySchema>;
