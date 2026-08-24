-- DropForeignKey
ALTER TABLE "Programme" DROP CONSTRAINT "Programme_categoryId_fkey";

-- DropIndex
DROP INDEX "Programme_categoryId_isPublished_idx";

-- AlterTable
ALTER TABLE "Programme" DROP COLUMN "categoryId";

-- CreateIndex
CREATE INDEX "Programme_isPublished_idx" ON "Programme"("isPublished");
