import { prisma } from "./src/lib/db/prisma.ts";

const categories = await prisma.programmeCategory.findMany({
  orderBy: { orderIndex: "asc" },
  include: { programmes: { select: { name: true, level: true, slug: true } } },
});

for (const cat of categories) {
  console.log(`\n=== ${cat.name} (slug: ${cat.slug}, order: ${cat.orderIndex}) ===`);
  for (const p of cat.programmes) {
    console.log(`  - ${p.name} | level="${p.level}" | slug=${p.slug}`);
  }
}
await prisma.$disconnect();
