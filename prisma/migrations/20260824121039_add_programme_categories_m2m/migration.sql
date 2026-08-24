-- CreateTable
CREATE TABLE "_ProgrammeCategories" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProgrammeCategories_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProgrammeCategories_B_index" ON "_ProgrammeCategories"("B");

-- AddForeignKey
ALTER TABLE "_ProgrammeCategories" ADD CONSTRAINT "_ProgrammeCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "Programme"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProgrammeCategories" ADD CONSTRAINT "_ProgrammeCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "ProgrammeCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
