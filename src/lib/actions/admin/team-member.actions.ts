"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/rbac";
import { teamMemberSchema } from "@/lib/validation/team-member.schema";
import type { ActionState } from "@/lib/actions/action-state";

export async function createTeamMember(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();

  const parsed = teamMemberSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  const member = await prisma.teamMember.create({ data: parsed.data });

  revalidatePath("/admin/team");
  redirect(`/admin/team/${member.id}`);
}

export async function updateTeamMember(
  memberId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = teamMemberSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  await prisma.teamMember.update({ where: { id: memberId }, data: parsed.data });

  revalidatePath("/admin/team");
  revalidatePath(`/admin/team/${memberId}`);
  revalidatePath("/team");
  redirect(`/admin/team/${memberId}`);
}

export async function deleteTeamMember(
  memberId: string,
  _prev: ActionState,
  _formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  await prisma.teamMember.delete({ where: { id: memberId } });
  revalidatePath("/admin/team");
  revalidatePath("/team");
  redirect("/admin/team");
}
