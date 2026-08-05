"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import sanitizeHtml from "sanitize-html";
import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/rbac";
import { newsPostSchema } from "@/lib/validation/news.schema";
import type { ActionState } from "@/lib/actions/action-state";

export async function createNewsPost(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();

  const parsed = newsPostSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  let postId: string;
  try {
    const post = await prisma.newsPost.create({
      data: { ...parsed.data, bodyHtml: sanitizeHtml(parsed.data.bodyHtml) },
    });
    postId = post.id;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "A post with this slug already exists." };
    }
    throw error;
  }

  revalidatePath("/admin/news");
  redirect(`/admin/news/${postId}`);
}

export async function updateNewsPost(
  postId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = newsPostSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  try {
    await prisma.newsPost.update({
      where: { id: postId },
      data: { ...parsed.data, bodyHtml: sanitizeHtml(parsed.data.bodyHtml) },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "A post with this slug already exists." };
    }
    throw error;
  }

  revalidatePath("/admin/news");
  revalidatePath(`/admin/news/${postId}`);
  revalidatePath("/news");
  redirect(`/admin/news/${postId}`);
}

export async function deleteNewsPost(
  postId: string,
  _prev: ActionState,
  _formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  await prisma.newsPost.delete({ where: { id: postId } });
  revalidatePath("/admin/news");
  revalidatePath("/news");
  redirect("/admin/news");
}
