import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "../src/lib/auth/password";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const DEV_PASSWORD = "Passw0rd!";

async function main() {
  const passwordHash = await hashPassword(DEV_PASSWORD);

  await prisma.adminUser.upsert({
    where: { email: "admin@cims.lk" },
    update: {},
    create: {
      email: "admin@cims.lk",
      name: "CIMS Admin",
      passwordHash,
      role: "ADMIN",
    },
  });

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      heroHeadline: "Your Faster Route to Higher Education",
      heroSubheadline:
        "Degree programmes and vocational training recognized worldwide.",
      aboutSummary:
        "CIMS Campus (College of Information Management and Sciences) has been empowering students with world-recognized qualifications since 2006, offering degree programmes and vocational training across Engineering & Technology, Business & Economics, and Law & Education.",
      chairmanMessageHtml:
        "Welcome to CIMS Campus. For nearly two decades, we have been committed to providing accessible, high-quality higher education that prepares our students for real careers. Our graduates go on to lead in industry, government, and their own ventures — and I invite you to become part of that story.",
      contactPhone: "+94 77 359 0505",
      contactEmail: "info@cims.lk",
      contactAddress: "CIMS Campus, Colombo, Sri Lanka",
      whatsappNumber: "+94773590505",
      facebookUrl: "https://www.facebook.com/www.cims.lk",
      instagramUrl: "https://www.instagram.com/cims.campus/",
      lmsUrl: "https://lms.cims.lk",
      certificateVerifyUrl: "https://lms.cims.lk/verify",
      onlinePaymentUrl: "https://lms.cims.lk/login?callbackUrl=/student/payments",
    },
  });

  const campusSeeds = [
    {
      name: "Colombo Campus",
      addressLine1: "CIMS Campus",
      city: "Colombo",
      phone: "+94 77 359 0505",
      email: "info@cims.lk",
      orderIndex: 0,
    },
    {
      name: "Kandy Campus",
      addressLine1: "CIMS Campus",
      city: "Kandy",
      phone: "+94 77 359 0505",
      email: "info@cims.lk",
      orderIndex: 1,
    },
    {
      name: "Kurunegala Campus",
      addressLine1: "CIMS Campus",
      city: "Kurunegala",
      phone: "+94 77 359 0505",
      email: "info@cims.lk",
      orderIndex: 2,
    },
  ];
  for (const campus of campusSeeds) {
    await prisma.campusLocation.upsert({
      where: { name: campus.name },
      update: {},
      create: campus,
    });
  }

  const programmeSeeds = [
    {
      slug: "bsc-software-engineering",
      name: "BSc (Hons) Software Engineering",
      category: "ENGINEERING_TECHNOLOGY" as const,
      level: "Bachelor's Degree",
      durationText: "3 Years",
      summary: "Build in-demand skills in software design, cloud systems, and modern engineering practice.",
      description:
        "This programme covers the full software engineering lifecycle — from requirements and design through to deployment and DevOps — with a strong emphasis on hands-on project work using modern frameworks and cloud platforms.",
      entryRequirements: "3 passes at G.C.E. A/L or equivalent, with a credit pass in Mathematics.",
      careerOutcomes: "Software Engineer, Cloud Engineer, DevOps Engineer, Technical Lead.",
      highlights: ["Industry-aligned curriculum", "Hands-on lab facilities", "Internship placements"],
      isFeatured: true,
      orderIndex: 0,
    },
    {
      slug: "bba-business-management",
      name: "BBA (Hons) Business Management",
      category: "BUSINESS_ECONOMICS" as const,
      level: "Bachelor's Degree",
      durationText: "3 Years",
      summary: "Develop the leadership, strategy, and analytical skills today's businesses need.",
      description:
        "A broad-based business management degree covering strategy, marketing, finance, and operations, with case-study driven teaching from lecturers with real industry experience.",
      entryRequirements: "3 passes at G.C.E. A/L or equivalent.",
      careerOutcomes: "Business Analyst, Marketing Executive, Operations Manager, Entrepreneur.",
      highlights: ["Real-world case studies", "Guest lectures from industry leaders", "Internship support"],
      isFeatured: true,
      orderIndex: 0,
    },
    {
      slug: "llb-law",
      name: "LLB (Hons) Law",
      category: "LAW_EDUCATION" as const,
      level: "Bachelor's Degree",
      durationText: "4 Years",
      summary: "A rigorous grounding in legal theory and practice, taught by practising professionals.",
      description:
        "Covers Sri Lankan and international legal frameworks, with moot court practice and mentorship from practising lawyers to prepare students for legal careers or further professional study.",
      entryRequirements: "3 passes at G.C.E. A/L or equivalent.",
      careerOutcomes: "Legal Associate, Corporate Counsel, Further study toward the Bar.",
      highlights: ["Moot court practice", "Mentorship from practising lawyers", "Small class sizes"],
      isFeatured: true,
      orderIndex: 0,
    },
    {
      slug: "study-abroad-uk-pathway",
      name: "UK University Pathway",
      category: "STUDY_ABROAD" as const,
      level: "Foundation",
      durationText: "1 Year",
      summary: "Start in Sri Lanka and progress to a partner university abroad with guaranteed credit transfer.",
      description:
        "A foundation year taught in Colombo that prepares students academically and linguistically for direct entry into the second year of a partner UK university's degree programme.",
      entryRequirements: "3 passes at G.C.E. A/L or equivalent, with an English language requirement.",
      careerOutcomes: "Progression to a partner university's Bachelor's degree programme abroad.",
      highlights: ["Guaranteed credit transfer", "Visa guidance support", "Partner university network"],
      isFeatured: true,
      orderIndex: 1,
    },
  ];

  const programmes: Record<string, { id: string }> = {};
  for (const programme of programmeSeeds) {
    const created = await prisma.programme.upsert({
      where: { slug: programme.slug },
      update: {},
      create: programme,
    });
    programmes[programme.slug] = created;
  }

  const newsSeeds = [
    {
      slug: "cims-graduation-ceremony-2026",
      kind: "NEWS" as const,
      title: "CIMS Campus Celebrates 2026 Graduation Ceremony",
      excerpt: "Over 500 graduates were conferred degrees and diplomas at this year's convocation.",
      bodyHtml:
        "<p>CIMS Campus held its annual graduation ceremony this month, celebrating over 500 graduates across Engineering & Technology, Business & Economics, and Law & Education. Chief guests praised the graduating class for their resilience and achievement.</p>",
      isPublished: true,
    },
    {
      slug: "new-intake-open-2026",
      kind: "ANNOUNCEMENT" as const,
      title: "Applications Now Open for 2026 Intake",
      excerpt: "Apply now for degree and diploma programmes starting this year.",
      bodyHtml:
        "<p>CIMS Campus is now accepting applications for the upcoming intake across all schools. Early applicants may be eligible for scholarship consideration.</p>",
      isPinned: true,
      isPublished: true,
    },
  ];
  for (const post of newsSeeds) {
    await prisma.newsPost.upsert({ where: { slug: post.slug }, update: {}, create: post });
  }

  const now = new Date();
  const nextMonth = new Date(now);
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  await prisma.event.upsert({
    where: { slug: "cims-open-day-2026" },
    update: {},
    create: {
      slug: "cims-open-day-2026",
      title: "CIMS Campus Open Day",
      description:
        "Meet our lecturers, tour the campus, and learn about our programmes across all four schools.",
      location: "CIMS Main Campus, Colombo",
      startAt: nextMonth,
      isFeatured: true,
      isPublished: true,
    },
  });

  // TeamMember and Testimonial have no natural unique field (a real CMS could
  // legitimately have two people share a name), so `upsert` isn't an option here.
  // Reset-and-recreate keeps this dev seed script safe to re-run without piling up
  // duplicates — fine since these are disposable sample rows, not admin-entered data.
  await prisma.testimonial.deleteMany({
    where: { studentName: { in: ["Sachini Perera", "Nimal Bandara", "Tharindu Gunasekara"] } },
  });
  await prisma.testimonial.createMany({
    data: [
      {
        studentName: "Sachini Perera",
        batchYear: 2024,
        programmeId: programmes["bsc-software-engineering"].id,
        quote:
          "CIMS gave me the practical skills and confidence to land a software engineering role before I even graduated.",
        isFeatured: true,
        orderIndex: 0,
      },
      {
        studentName: "Nimal Bandara",
        batchYear: 2023,
        programmeId: programmes["bba-business-management"].id,
        quote: "Small class sizes meant lecturers actually knew who I was — that made all the difference.",
        isFeatured: true,
        orderIndex: 1,
      },
      {
        studentName: "Tharindu Gunasekara",
        batchYear: 2024,
        programmeId: programmes["llb-law"].id,
        quote:
          "The moot court practice and mentorship from real lawyers prepared me far better than I expected.",
        isFeatured: true,
        orderIndex: 2,
      },
    ],
  });

  await prisma.teamMember.deleteMany({
    where: { name: { in: ["Dr. A. Perera", "Prof. S. Wickramasinghe", "Dr. J. Smith"] } },
  });
  await prisma.teamMember.createMany({
    data: [
      {
        name: "Dr. A. Perera",
        category: "BOARD_OF_GOVERNORS",
        title: "Chairman",
        bio: "Dr. Perera has led CIMS Campus since its founding in 2006, with a background in higher education administration.",
        orderIndex: 0,
      },
      {
        name: "Prof. S. Wickramasinghe",
        category: "ACADEMIC_BOARD",
        title: "Dean of Academic Affairs",
        bio: "Prof. Wickramasinghe oversees curriculum quality and academic standards across all CIMS programmes.",
        orderIndex: 0,
      },
      {
        name: "Dr. J. Smith",
        category: "INTERNATIONAL_REPRESENTATIVE",
        title: "UK Partnerships Representative",
        bio: "Dr. Smith coordinates CIMS's study-abroad pathway partnerships with universities in the United Kingdom.",
        orderIndex: 0,
      },
    ],
  });

  console.log(`Seed complete. Admin login: admin@cims.lk / ${DEV_PASSWORD}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
