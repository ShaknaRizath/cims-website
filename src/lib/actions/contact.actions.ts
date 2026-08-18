"use server";

import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { contactMessageSchema } from "@/lib/validation/contact.schema";
import { sendContactNotification } from "@/lib/email/send-contact-notification";
import type { ActionState } from "@/lib/actions/action-state";

export async function submitContactMessage(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = contactMessageSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  const contactMessage = await prisma.contactMessage.create({ data: parsed.data });
  await sendContactNotification(contactMessage);

  return {};
}
