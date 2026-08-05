import Link from "next/link";
import Image from "next/image";
import { Newspaper } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export interface NewsCardData {
  slug: string;
  title: string;
  excerpt: string | null;
  kind: string;
  coverImageUrl: string | null;
  publishedAt: Date;
}

export function NewsCard({ post }: { post: NewsCardData }) {
  return (
    <Card className="group h-full gap-0 py-0 transition-shadow hover:shadow-lg">
      <Link href={`/news/${post.slug}`} className="flex h-full flex-col">
        <div className="relative flex aspect-video items-center justify-center overflow-hidden bg-gradient-to-br from-secondary to-secondary/60 text-primary">
          {post.coverImageUrl ? (
            <Image src={post.coverImageUrl} alt="" fill unoptimized className="object-cover" />
          ) : (
            <Newspaper className="size-10" />
          )}
        </div>
        <div className="flex flex-1 flex-col gap-3 p-6">
          <div className="flex items-center gap-2">
            <Badge variant={post.kind === "ANNOUNCEMENT" ? "default" : "secondary"}>
              {post.kind === "ANNOUNCEMENT" ? "Announcement" : "News"}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {post.publishedAt.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
            </span>
          </div>
          <h3 className="font-heading text-lg font-semibold text-foreground">{post.title}</h3>
          {post.excerpt && <p className="line-clamp-2 flex-1 text-sm text-muted-foreground">{post.excerpt}</p>}
        </div>
      </Link>
    </Card>
  );
}
