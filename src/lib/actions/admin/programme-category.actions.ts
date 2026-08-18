"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/rbac";
import { programmeCategorySchema } from "@/lib/validation/programme-category.schema";
import type { ActionState } from "@/lib/actions/action-state";

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function uniqueSlug(name: string, excludeId?: string) {
  const base = slugify(name) || "category";
  let slug = base;
  let suffix = 2;
  while (
    await prisma.programmeCategory.findFirst({
      where: { slug, ...(excludeId ? { id: { not: excludeId } } : {}) },
    })
  ) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }
  return slug;
}

export async function createProgrammeCategory(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();

  const parsed = programmeCategorySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  let categoryId: string;
  try {
    const slug = await uniqueSlug(parsed.data.name);
    const category = await prisma.programmeCategory.create({ data: { ...parsed.data, slug } });
    categoryId = category.id;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "A category with this name already exists." };
    }
    throw error;
  }

  revalidatePath("/admin/categories");
  revalidatePath("/programmes");
  redirect(`/admin/categories/${categoryId}`);
}

export async function updateProgrammeCategory(
  categoryId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = programmeCategorySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  try {
    const slug = await uniqueSlug(parsed.data.name, categoryId);
    await prisma.programmeCategory.update({ where: { id: categoryId }, data: { ...parsed.data, slug } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "A category with this name already exists." };
    }
    throw error;
  }

  revalidatePath("/admin/categories");
  revalidatePath(`/admin/categories/${categoryId}`);
  revalidatePath("/programmes");
  redirect(`/admin/categories/${categoryId}`);
}

export async function deleteProgrammeCategory(
  categoryId: string,
  _prev: ActionState,
  _formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  try {
    await prisma.programmeCategory.delete({ where: { id: categoryId } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
      return { error: "This category still has programmes assigned to it. Move or delete those programmes first." };
    }
    throw error;
  }

  revalidatePath("/admin/categories");
  revalidatePath("/programmes");
  redirect("/admin/categories");
}
