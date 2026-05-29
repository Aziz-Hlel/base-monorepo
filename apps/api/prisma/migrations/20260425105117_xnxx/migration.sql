/*
  Warnings:

  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "CapacityTypeEnum" AS ENUM ('MAJOR', 'ELECTIVE');

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_thumbnailId_fkey";

-- DropForeignKey
ALTER TABLE "TeacherExamSession" DROP CONSTRAINT "TeacherExamSession_examSessionId_fkey";

-- AlterTable
ALTER TABLE "SchoolElectiveExam" ALTER COLUMN "examId" DROP NOT NULL;

-- DropTable
DROP TABLE "Product";

-- DropEnum
DROP TYPE "ProductStatus";

-- CreateTable
CREATE TABLE "SchoolCapacityStats" (
    "id" TEXT NOT NULL,
    "schoolId" UUID NOT NULL,
    "majorId" UUID,
    "examId" UUID,
    "nbrClasses" INTEGER NOT NULL,
    "type" "CapacityTypeEnum" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SchoolCapacityStats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SchoolCapacityStats_schoolId_majorId_key" ON "SchoolCapacityStats"("schoolId", "majorId");

-- CreateIndex
CREATE UNIQUE INDEX "SchoolCapacityStats_schoolId_examId_key" ON "SchoolCapacityStats"("schoolId", "examId");

-- AddForeignKey
ALTER TABLE "SchoolCapacityStats" ADD CONSTRAINT "SchoolCapacityStats_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolCapacityStats" ADD CONSTRAINT "SchoolCapacityStats_majorId_fkey" FOREIGN KEY ("majorId") REFERENCES "Major"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolCapacityStats" ADD CONSTRAINT "SchoolCapacityStats_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherExamSession" ADD CONSTRAINT "TeacherExamSession_examSessionId_fkey" FOREIGN KEY ("examSessionId") REFERENCES "ExamSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
