"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/rbac";
import { siteSettingsSchema } from "@/lib/validation/settings.schema";
import type { ActionState } from "@/lib/actions/action-state";

export async function updateSiteSettings(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();

  const parsed = siteSettingsSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: parsed.data,
    create: { id: "singleton", ...parsed.data },
  });

  revalidatePath("/admin/settings");
  revalidatePath("/");
  revalidatePath("/about");
  return undefined;
}
