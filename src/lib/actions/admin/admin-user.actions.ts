"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/rbac";
import { hashPassword } from "@/lib/auth/password";
import { adminUserSchema } from "@/lib/validation/admin-user.schema";
import type { ActionState } from "@/lib/actions/action-state";

export async function createAdminUser(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();

  const parsed = adminUserSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  const passwordHash = await hashPassword(parsed.data.password);

  try {
    await prisma.adminUser.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        passwordHash,
        role: parsed.data.role,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "An admin with this email already exists." };
    }
    throw error;
  }

  revalidatePath("/admin/admins");
  redirect("/admin/admins");
}

export async function toggleAdminUserActive(
  targetAdminId: string,
  _prev: ActionState,
  _formData: FormData,
): Promise<ActionState> {
  const currentAdmin = await requireAdmin();

  if (targetAdminId === currentAdmin.id) {
    return { error: "You can't deactivate your own account." };
  }

  const target = await prisma.adminUser.findUnique({ where: { id: targetAdminId } });
  if (!target) {
    return { error: "Admin user not found." };
  }

  const nextIsActive = !target.isActive;

  // Deactivating the last active Administrator would leave nobody able to manage
  // admin accounts (or anything else ADMIN-only) — block it rather than allow a lockout.
  if (!nextIsActive && target.role === "ADMIN") {
    const otherActiveAdmins = await prisma.adminUser.count({
      where: { role: "ADMIN", isActive: true, id: { not: target.id } },
    });
    if (otherActiveAdmins === 0) {
      return { error: "You can't deactivate the last remaining Administrator account." };
    }
  }

  await prisma.adminUser.update({ where: { id: targetAdminId }, data: { isActive: nextIsActive } });
  revalidatePath("/admin/admins");
}
