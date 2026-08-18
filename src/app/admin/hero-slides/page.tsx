import Link from "next/link";
import Image from "next/image";
import { GalleryHorizontal } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

export default async function AdminHeroSlidesPage() {
  const slides = await prisma.heroSlide.findMany({
    orderBy: [{ orderIndex: "asc" }],
  });

  return (
    <div>
      <AdminPageHeader
        title="Hero Slides"
        description="Background photos that automatically cycle in the homepage hero section."
        newLabel="New Hero Slide"
        newHref="/admin/hero-slides/new"
      />
      {slides.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <GalleryHorizontal />
            </EmptyMedia>
            <EmptyTitle>No hero slides yet</EmptyTitle>
            <EmptyDescription>
              Add at least one photo — with two or more published, the homepage hero will auto-cycle between them.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Preview</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {slides.map((slide) => (
              <TableRow key={slide.id}>
                <TableCell>
                  <Link href={`/admin/hero-slides/${slide.id}`} className="flex items-center gap-3 hover:underline">
                    <Image
                      src={slide.imageUrl}
                      alt=""
                      width={64}
                      height={40}
                      unoptimized
                      className="h-10 w-16 rounded object-cover"
                    />
                    <span className="font-medium">Slide</span>
                  </Link>
                </TableCell>
                <TableCell>{slide.orderIndex}</TableCell>
                <TableCell>
                  <Badge variant={slide.isPublished ? "secondary" : "outline"}>
                    {slide.isPublished ? "Published" : "Draft"}
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
