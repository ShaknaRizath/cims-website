"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin, requireAnyAdmin } from "@/lib/auth/rbac";
import { ApplicationStatus } from "@/generated/prisma/enums";
import type { ActionState } from "@/lib/actions/action-state";

const statusSchema = z.enum(ApplicationStatus);

export async function updateApplicationStatus(
  applicationId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  // Both roles may triage applications; deleteApplication below stays ADMIN-only.
  await requireAnyAdmin();

  const parsed = statusSchema.safeParse(formData.get("status"));
  if (!parsed.success) {
    return { error: "Invalid status." };
  }

  await prisma.application.update({
    where: { id: applicationId },
    data: { status: parsed.data },
  });

  revalidatePath("/admin/applications");
  revalidatePath(`/admin/applications/${applicationId}`);
}

export async function deleteApplication(
  applicationId: string,
  _prev: ActionState,
  _formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  await prisma.application.delete({ where: { id: applicationId } });
  revalidatePath("/admin/applications");
  redirect("/admin/applications");
}
