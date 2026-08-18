-- CreateTable
CREATE TABLE "HeroSlide" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeroSlide_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HeroSlide_isPublished_idx" ON "HeroSlide"("isPublished");

-- Preserve the existing Settings hero image as the first hero slide before
-- dropping the column it lived in.
INSERT INTO "HeroSlide" ("id", "imageUrl", "orderIndex", "isPublished", "createdAt", "updatedAt")
SELECT
  'hero-slide-migrated-' || "id",
  "heroImageUrl",
  0,
  true,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "SiteSettings"
WHERE "heroImageUrl" IS NOT NULL;

-- AlterTable
ALTER TABLE "SiteSettings" DROP COLUMN "heroImageUrl";
