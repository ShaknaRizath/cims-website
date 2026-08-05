import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NewsPostForm } from "@/components/admin/news-post-form";
import { DeleteConfirmButton } from "@/components/admin/delete-confirm-button";
import { updateNewsPost, deleteNewsPost } from "@/lib/actions/admin/news.actions";

export default async function NewsPostDetailPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;

  const post = await prisma.newsPost.findUnique({ where: { id: postId } });
  if (!post) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-foreground">{post.title}</h1>
        <DeleteConfirmButton
          action={deleteNewsPost.bind(null, post.id)}
          title={`Delete "${post.title}"?`}
          description="This permanently deletes the post. This cannot be undone."
        />
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Edit post</CardTitle>
        </CardHeader>
        <CardContent>
          <NewsPostForm
            action={updateNewsPost.bind(null, post.id)}
            defaultValues={post}
            submitLabel="Save changes"
          />
        </CardContent>
      </Card>
    </div>
  );
}
