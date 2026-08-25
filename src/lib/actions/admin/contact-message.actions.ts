"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/rbac";
import type { ActionState } from "@/lib/actions/action-state";

export async function markContactMessageRead(
  contactMessageId: string,
  _prev: ActionState,
  _formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  await prisma.contactMessage.update({ where: { id: contactMessageId }, data: { isRead: true } });
  revalidatePath("/admin/contact-messages");
  return undefined;
}

export async function deleteContactMessage(
  contactMessageId: string,
  _prev: ActionState,
  _formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  await prisma.contactMessage.delete({ where: { id: contactMessageId } });
  revalidatePath("/admin/contact-messages");
  redirect("/admin/contact-messages");
}
