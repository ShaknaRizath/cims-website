"use server";

import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { applicationSchema, DOCUMENT_SLOTS } from "@/lib/validation/application.schema";
import { sendApplicationNotification } from "@/lib/email/send-application-notification";

export type ApplyActionState =
  | { error?: string; fieldErrors?: Record<string, string[] | undefined>; success?: boolean }
  | undefined;

// Documents are uploaded straight from the browser to Cloudinary before submit
// (see DocumentUploadField) and arrive here as JSON `{ url, fileName }` strings in
// hidden inputs — not raw File objects. Vercel hard-caps a Server Action's request
// body at 4.5MB, which even one real certificate scan can exceed, so the actual
// file bytes never pass through this action.
function parseUploadedDocs(formData: FormData, fieldName: string): { url: string; fileName: string }[] {
  return formData
    .getAll(fieldName)
    .filter((value): value is string => typeof value === "string" && value.length > 0)
    .map((value) => {
      try {
        const parsed = JSON.parse(value);
        return typeof parsed?.url === "string" && typeof parsed?.fileName === "string" ? parsed : null;
      } catch {
        return null;
      }
    })
    .filter((doc): doc is { url: string; fileName: string } => doc !== null);
}

export async function submitApplication(_prev: ApplyActionState, formData: FormData): Promise<ApplyActionState> {
  const parsed = applicationSchema.safeParse(Object.fromEntries(formData));
  const fieldErrors: Record<string, string[] | undefined> = parsed.success
    ? {}
    : z.flattenError(parsed.error).fieldErrors;

  const documentsToCreate: { documentType: string; fileUrl: string; fileName: string }[] = [];
  for (const slot of DOCUMENT_SLOTS) {
    const docs = parseUploadedDocs(formData, slot.fieldName);
    if (slot.required && docs.length === 0) {
      fieldErrors[slot.fieldName] = [`${slot.label} is required.`];
      continue;
    }
    for (const doc of docs) {
      documentsToCreate.push({ documentType: slot.key, fileUrl: doc.url, fileName: doc.fileName });
    }
  }

  if (!parsed.success || Object.values(fieldErrors).some((errors) => errors?.length)) {
    return { fieldErrors };
  }

  const programme = await prisma.programme.findUnique({ where: { id: parsed.data.programmeId } });
  if (!programme || !programme.isPublished) {
    return { fieldErrors: { programmeId: ["Select a valid programme."] } };
  }

  const {
    fullName,
    nameWithInitials,
    dateOfBirth,
    gender,
    nicOrPassport,
    email,
    mobileNumber,
    address,
    nationality,
    programmeId,
    highestQualification,
    institution,
    yearCompleted,
    additionalQualifications,
  } = parsed.data;

  const application = await prisma.application.create({
    data: {
      fullName,
      nameWithInitials,
      dateOfBirth,
      gender,
      nicOrPassport,
      email,
      mobileNumber,
      address,
      nationality,
      programmeId,
      highestQualification,
      institution,
      yearCompleted,
      additionalQualifications,
      documents: { create: documentsToCreate },
    },
  });

  await sendApplicationNotification(application);

  return { success: true };
}
