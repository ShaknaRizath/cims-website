-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN     "aboutTeaserImageUrl" TEXT,
ADD COLUMN     "ourMission" TEXT,
ADD COLUMN     "ourRole" TEXT,
ADD COLUMN     "ourVision" TEXT;

-- CreateTable
CREATE TABLE "PartnerUniversity" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT,
    "websiteUrl" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PartnerUniversity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PartnerUniversity_isPublished_idx" ON "PartnerUniversity"("isPublished");
