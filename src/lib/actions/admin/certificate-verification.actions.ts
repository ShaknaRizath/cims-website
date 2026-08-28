"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/rbac";
import type { ActionState } from "@/lib/actions/action-state";

export async function deleteCertificateVerificationRequest(
  requestId: string,
  _prev: ActionState,
  _formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  await prisma.certificateVerificationRequest.delete({ where: { id: requestId } });
  revalidatePath("/admin/certificate-verification-requests");
  redirect("/admin/certificate-verification-requests");
}
