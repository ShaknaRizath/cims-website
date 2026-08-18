import { z } from "zod";

export const contactMessageSchema = z.object({
  name: z.string().min(2, { error: "Name must be at least 2 characters." }),
  mobile: z.string().min(7, { error: "Enter a valid mobile number." }),
  email: z.email({ error: "Enter a valid email address." }),
  subject: z.string().min(2, { error: "Subject must be at least 2 characters." }),
  message: z.string().min(10, { error: "Message must be at least 10 characters." }),
});

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;
