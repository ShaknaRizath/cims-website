import Link from "next/link";
import { Quote } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

export default async function AdminTestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { orderIndex: "asc" },
    include: { programme: { select: { name: true } } },
  });

  return (
    <div>
      <AdminPageHeader
        title="Testimonials"
        description="Student success stories shown on the homepage and Success Stories page."
        newLabel="New Testimonial"
        newHref="/admin/testimonials/new"
      />
      {testimonials.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Quote />
            </EmptyMedia>
            <EmptyTitle>No testimonials yet</EmptyTitle>
            <EmptyDescription>Student testimonials you add will appear here.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Programme</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testimonials.map((testimonial) => (
              <TableRow key={testimonial.id}>
                <TableCell className="font-medium">
                  <Link href={`/admin/testimonials/${testimonial.id}`} className="hover:underline">
                    {testimonial.studentName}
                  </Link>
                </TableCell>
                <TableCell>{testimonial.programmeName ?? testimonial.programme?.name ?? "—"}</TableCell>
                <TableCell>{testimonial.isFeatured ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <Badge variant={testimonial.isPublished ? "secondary" : "outline"}>
                    {testimonial.isPublished ? "Published" : "Draft"}
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
