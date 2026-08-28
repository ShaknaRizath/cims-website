"use server";

import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { certificateVerificationRequestSchema } from "@/lib/validation/certificate-verification.schema";
import { sendCertificateVerificationNotification } from "@/lib/email/send-certificate-verification-notification";
import type { ActionState } from "@/lib/actions/action-state";

export async function submitCertificateVerificationRequest(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = certificateVerificationRequestSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  const request = await prisma.certificateVerificationRequest.create({ data: parsed.data });
  await sendCertificateVerificationNotification(request);

  return {};
}
