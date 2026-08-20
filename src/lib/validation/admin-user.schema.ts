import { z } from "zod";
import { AdminRole } from "@/generated/prisma/enums";

export const adminUserSchema = z.object({
  name: z.string().min(2, { error: "Name must be at least 2 characters." }),
  email: z.email({ error: "Enter a valid email address." }),
  password: z.string().min(8, { error: "Password must be at least 8 characters." }),
  role: z.enum(AdminRole),
});

export type AdminUserInput = z.infer<typeof adminUserSchema>;
