"use server";

import { randomUUID } from "node:crypto";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { storage } from "@/lib/storage";
import { applicationSchema, DOCUMENT_SLOTS, MAX_DOCUMENT_SIZE_BYTES } from "@/lib/validation/application.schema";
import { sendApplicationNotification } from "@/lib/email/send-application-notification";

export type ApplyActionState =
  | { error?: string; fieldErrors?: Record<string, string[] | undefined>; success?: boolean }
  | undefined;

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9.\-_ ]/g, "_").trim() || "file";
}

export async function submitApplication(_prev: ApplyActionState, formData: FormData): Promise<ApplyActionState> {
  const parsed = applicationSchema.safeParse(Object.fromEntries(formData));
  const fieldErrors: Record<string, string[] | undefined> = parsed.success
    ? {}
    : z.flattenError(parsed.error).fieldErrors;

  // Collect valid (non-empty) files per document slot, validating required + size
  // server-side — client-side `required`/`accept` only guides the UI.
  const filesBySlot = new Map<string, File[]>();
  for (const slot of DOCUMENT_SLOTS) {
    const files = formData.getAll(slot.fieldName).filter((f): f is File => f instanceof File && f.size > 0);
    if (slot.required && files.length === 0) {
      fieldErrors[slot.fieldName] = [`${slot.label} is required.`];
      continue;
    }
    const oversized = files.find((f) => f.size > MAX_DOCUMENT_SIZE_BYTES);
    if (oversized) {
      fieldErrors[slot.fieldName] = [`${oversized.name} is larger than 10MB.`];
      continue;
    }
    filesBySlot.set(slot.key, files);
  }

  if (!parsed.success || Object.values(fieldErrors).some((errors) => errors?.length)) {
    return { fieldErrors };
  }

  const programme = await prisma.programme.findUnique({ where: { id: parsed.data.programmeId } });
  if (!programme || !programme.isPublished) {
    return { fieldErrors: { programmeId: ["Select a valid programme."] } };
  }

  const documentsToCreate: { documentType: string; fileUrl: string; fileName: string }[] = [];
  for (const [documentType, files] of filesBySlot) {
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `${randomUUID()}-${sanitizeFilename(file.name)}`;
      const uploaded = await storage.uploadBuffer({
        folder: "applications",
        filename,
        buffer,
        contentType: file.type || "application/octet-stream",
      });
      documentsToCreate.push({ documentType, fileUrl: uploaded.url, fileName: file.name });
    }
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
