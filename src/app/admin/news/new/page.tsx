import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NewsPostForm } from "@/components/admin/news-post-form";
import { createNewsPost } from "@/lib/actions/admin/news.actions";

export default function NewNewsPostPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">New Post</h1>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Post details</CardTitle>
        </CardHeader>
        <CardContent>
          <NewsPostForm action={createNewsPost} submitLabel="Create post" />
        </CardContent>
      </Card>
    </div>
  );
}
