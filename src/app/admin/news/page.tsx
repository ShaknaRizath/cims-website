import Link from "next/link";
import { Newspaper } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

export default async function AdminNewsPage() {
  const posts = await prisma.newsPost.findMany({ orderBy: { publishedAt: "desc" } });

  return (
    <div>
      <AdminPageHeader
        title="News & Announcements"
        description="Posts shown on the public News page."
        newLabel="New Post"
        newHref="/admin/news/new"
      />
      {posts.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Newspaper />
            </EmptyMedia>
            <EmptyTitle>No posts yet</EmptyTitle>
            <EmptyDescription>News and announcements you publish will appear here.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Kind</TableHead>
              <TableHead>Published</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">
                  <Link href={`/admin/news/${post.id}`} className="hover:underline">
                    {post.title}
                  </Link>
                </TableCell>
                <TableCell>{post.kind}</TableCell>
                <TableCell>{post.publishedAt.toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant={post.isPublished ? "secondary" : "outline"}>
                    {post.isPublished ? "Published" : "Draft"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
