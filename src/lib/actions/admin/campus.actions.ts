"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/rbac";
import { campusSchema } from "@/lib/validation/campus.schema";
import type { ActionState } from "@/lib/actions/action-state";

export async function createCampus(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();

  const parsed = campusSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  let campusId: string;
  try {
    const campus = await prisma.campusLocation.create({ data: parsed.data });
    campusId = campus.id;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "A campus with this name already exists." };
    }
    throw error;
  }

  revalidatePath("/admin/campuses");
  redirect(`/admin/campuses/${campusId}`);
}

export async function updateCampus(
  campusId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = campusSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  try {
    await prisma.campusLocation.update({ where: { id: campusId }, data: parsed.data });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "A campus with this name already exists." };
    }
    throw error;
  }

  revalidatePath("/admin/campuses");
  revalidatePath(`/admin/campuses/${campusId}`);
  revalidatePath("/contact");
  redirect(`/admin/campuses/${campusId}`);
}

export async function deleteCampus(
  campusId: string,
  _prev: ActionState,
  _formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  await prisma.campusLocation.delete({ where: { id: campusId } });
  revalidatePath("/admin/campuses");
  revalidatePath("/contact");
  redirect("/admin/campuses");
}
