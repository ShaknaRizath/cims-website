import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { ApplyForm } from "@/components/marketing/apply-form";
import { PageHero } from "@/components/marketing/page-hero";

export const metadata: Metadata = {
  title: "Apply Now | CIMS Campus",
  description: "Start your online application to a CIMS Campus programme.",
};

export default async function ApplyPage() {
  const programmes = await prisma.programme.findMany({
    where: { isPublished: true },
    orderBy: [{ category: { orderIndex: "asc" } }, { orderIndex: "asc" }],
    select: { id: true, name: true },
  });

  return (
    <>
      <PageHero
        title="Apply Now"
        description="Complete the online application form below to start your journey with CIMS Campus."
      />
      <div className="mx-auto max-w-7xl px-6 py-16">
        <ApplyForm programmes={programmes} />
      </div>
    </>
  );
}
