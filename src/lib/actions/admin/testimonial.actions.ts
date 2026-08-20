"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/rbac";
import { testimonialSchema } from "@/lib/validation/testimonial.schema";
import type { ActionState } from "@/lib/actions/action-state";

// A typed-in programme name always wins over the dropdown selection, and
// clears the other field explicitly — `undefined` would leave a stale value
// in place on update instead of clearing it.
function resolveProgrammeFields(data: { programmeId?: string; programmeName?: string }) {
  if (data.programmeName) {
    return { programmeId: null, programmeName: data.programmeName };
  }
  return { programmeId: data.programmeId ?? null, programmeName: null };
}

export async function createTestimonial(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();

  const parsed = testimonialSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  const testimonial = await prisma.testimonial.create({
    data: { ...parsed.data, ...resolveProgrammeFields(parsed.data) },
  });

  revalidatePath("/admin/testimonials");
  redirect(`/admin/testimonials/${testimonial.id}`);
}

export async function updateTestimonial(
  testimonialId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = testimonialSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  await prisma.testimonial.update({
    where: { id: testimonialId },
    data: { ...parsed.data, ...resolveProgrammeFields(parsed.data) },
  });

  revalidatePath("/admin/testimonials");
  revalidatePath(`/admin/testimonials/${testimonialId}`);
  revalidatePath("/success-stories");
  revalidatePath("/");
  redirect(`/admin/testimonials/${testimonialId}`);
}

export async function deleteTestimonial(
  testimonialId: string,
  _prev: ActionState,
  _formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  await prisma.testimonial.delete({ where: { id: testimonialId } });
  revalidatePath("/admin/testimonials");
  revalidatePath("/success-stories");
  revalidatePath("/");
  redirect("/admin/testimonials");
}
