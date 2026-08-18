"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/rbac";
import { heroSlideSchema } from "@/lib/validation/hero-slide.schema";
import type { ActionState } from "@/lib/actions/action-state";

export async function createHeroSlide(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();

  const parsed = heroSlideSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  const slide = await prisma.heroSlide.create({ data: parsed.data });

  revalidatePath("/admin/hero-slides");
  revalidatePath("/");
  redirect(`/admin/hero-slides/${slide.id}`);
}

export async function updateHeroSlide(
  slideId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = heroSlideSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  await prisma.heroSlide.update({ where: { id: slideId }, data: parsed.data });

  revalidatePath("/admin/hero-slides");
  revalidatePath(`/admin/hero-slides/${slideId}`);
  revalidatePath("/");
  redirect(`/admin/hero-slides/${slideId}`);
}

export async function deleteHeroSlide(
  slideId: string,
  _prev: ActionState,
  _formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  await prisma.heroSlide.delete({ where: { id: slideId } });
  revalidatePath("/admin/hero-slides");
  revalidatePath("/");
  redirect("/admin/hero-slides");
}
