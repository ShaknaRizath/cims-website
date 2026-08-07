import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/marketing/reveal";
import { CtaBanner } from "@/components/marketing/cta-banner";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.newsPost.findUnique({ where: { slug } });
  if (!post) return {};
  return {
    title: `${post.title} | CIMS Campus`,
    description: post.excerpt ?? undefined,
  };
}

export default async function NewsPostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await prisma.newsPost.findUnique({ where: { slug } });
  if (!post || !post.isPublished) notFound();

  return (
    <>
      <article className="mx-auto max-w-3xl px-6 py-16">
        <Reveal className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Badge variant={post.kind === "ANNOUNCEMENT" ? "default" : "secondary"}>
              {post.kind === "ANNOUNCEMENT" ? "Announcement" : "News"}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {post.publishedAt.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
            </span>
          </div>
          <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">{post.title}</h1>
        </Reveal>

        {post.coverImageUrl && (
          <Reveal delayMs={100} className="relative mt-8 aspect-video overflow-hidden rounded-xl">
            <Image src={post.coverImageUrl} alt="" fill unoptimized className="object-cover" />
          </Reveal>
        )}

        <Reveal delayMs={200} className="prose prose-neutral mt-8 max-w-none">
          <div dangerouslySetInnerHTML={{ __html: post.bodyHtml }} />
        </Reveal>
      </article>
      <CtaBanner />
    </>
  );
}
