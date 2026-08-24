"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/rbac";
import { programmeSchema } from "@/lib/validation/programme.schema";
import type { ActionState } from "@/lib/actions/action-state";

export async function createProgramme(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();

  // formData.getAll() is needed for the categoryIds checkbox group — Object.fromEntries()
  // only keeps the last value for a repeated key, collapsing a multi-select to one.
  const parsed = programmeSchema.safeParse({
    ...Object.fromEntries(formData),
    categoryIds: formData.getAll("categoryIds"),
  });
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  const { categoryIds, ...data } = parsed.data;

  let programmeId: string;
  try {
    const programme = await prisma.programme.create({
      data: { ...data, categories: { connect: categoryIds.map((id) => ({ id })) } },
    });
    programmeId = programme.id;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "A programme with this slug already exists." };
    }
    throw error;
  }

  revalidatePath("/admin/programmes");
  redirect(`/admin/programmes/${programmeId}`);
}

export async function updateProgramme(
  programmeId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = programmeSchema.safeParse({
    ...Object.fromEntries(formData),
    categoryIds: formData.getAll("categoryIds"),
  });
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  const { categoryIds, ...data } = parsed.data;

  try {
    await prisma.programme.update({
      where: { id: programmeId },
      data: { ...data, categories: { set: categoryIds.map((id) => ({ id })) } },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "A programme with this slug already exists." };
    }
    throw error;
  }

  revalidatePath("/admin/programmes");
  revalidatePath(`/admin/programmes/${programmeId}`);
  revalidatePath("/programmes");
  redirect(`/admin/programmes/${programmeId}`);
}

export async function deleteProgramme(
  programmeId: string,
  _prev: ActionState,
  _formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  // Testimonials referencing this programme keep their row — the relation is
  // onDelete: SetNull, not cascaded.
  await prisma.programme.delete({ where: { id: programmeId } });
  revalidatePath("/admin/programmes");
  revalidatePath("/programmes");
  redirect("/admin/programmes");
}
