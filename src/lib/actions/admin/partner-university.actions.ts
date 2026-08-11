"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/rbac";
import { partnerUniversitySchema } from "@/lib/validation/partner-university.schema";
import type { ActionState } from "@/lib/actions/action-state";

export async function createPartnerUniversity(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();

  const parsed = partnerUniversitySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  const partner = await prisma.partnerUniversity.create({ data: parsed.data });

  revalidatePath("/admin/partners");
  revalidatePath("/");
  redirect(`/admin/partners/${partner.id}`);
}

export async function updatePartnerUniversity(
  partnerId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = partnerUniversitySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  await prisma.partnerUniversity.update({ where: { id: partnerId }, data: parsed.data });

  revalidatePath("/admin/partners");
  revalidatePath(`/admin/partners/${partnerId}`);
  revalidatePath("/");
  redirect(`/admin/partners/${partnerId}`);
}

export async function deletePartnerUniversity(
  partnerId: string,
  _prev: ActionState,
  _formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  await prisma.partnerUniversity.delete({ where: { id: partnerId } });
  revalidatePath("/admin/partners");
  revalidatePath("/");
  redirect("/admin/partners");
}
