"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/rbac";
import { eventSchema } from "@/lib/validation/event.schema";
import type { ActionState } from "@/lib/actions/action-state";

export async function createEvent(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();

  const parsed = eventSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  let eventId: string;
  try {
    const event = await prisma.event.create({ data: parsed.data });
    eventId = event.id;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "An event with this slug already exists." };
    }
    throw error;
  }

  revalidatePath("/admin/events");
  redirect(`/admin/events/${eventId}`);
}

export async function updateEvent(
  eventId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = eventSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  try {
    await prisma.event.update({ where: { id: eventId }, data: parsed.data });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "An event with this slug already exists." };
    }
    throw error;
  }

  revalidatePath("/admin/events");
  revalidatePath(`/admin/events/${eventId}`);
  revalidatePath("/events");
  redirect(`/admin/events/${eventId}`);
}

export async function deleteEvent(
  eventId: string,
  _prev: ActionState,
  _formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  await prisma.event.delete({ where: { id: eventId } });
  revalidatePath("/admin/events");
  revalidatePath("/events");
  redirect("/admin/events");
}
