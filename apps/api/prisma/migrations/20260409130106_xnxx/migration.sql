/*
  Warnings:

  - You are about to drop the column `optionalExamId` on the `Exam` table. All the data in the column will be lost.
  - You are about to drop the `OptionalExam` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SchoolOptionalExam` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `name` on the `Major` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ElectiveExamEnum" AS ENUM ('SPANISH', 'MUSIC', 'ITALIAN', 'MANDARIN', 'MATH', 'GERMAN');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "SubjectEnum" ADD VALUE 'MANDARIN';
ALTER TYPE "SubjectEnum" ADD VALUE 'MUSIC';
ALTER TYPE "SubjectEnum" ADD VALUE 'SPANISH';
ALTER TYPE "SubjectEnum" ADD VALUE 'GERMAN';
ALTER TYPE "SubjectEnum" ADD VALUE 'ITALIAN';
ALTER TYPE "SubjectEnum" ADD VALUE 'ARABIC';

-- DropForeignKey
ALTER TABLE "Exam" DROP CONSTRAINT "Exam_optionalExamId_fkey";

-- DropForeignKey
ALTER TABLE "SchoolMajors" DROP CONSTRAINT "SchoolMajors_majorId_fkey";

-- DropForeignKey
ALTER TABLE "SchoolMajors" DROP CONSTRAINT "SchoolMajors_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "SchoolOptionalExam" DROP CONSTRAINT "SchoolOptionalExam_optionalExamId_fkey";

-- DropForeignKey
ALTER TABLE "SchoolOptionalExam" DROP CONSTRAINT "SchoolOptionalExam_schoolId_fkey";

-- DropIndex
DROP INDEX "Exam_optionalExamId_subject_term_key";

-- DropIndex
DROP INDEX "Exam_term_idx";

-- AlterTable
ALTER TABLE "Exam" DROP COLUMN "optionalExamId",
ADD COLUMN     "electiveExamId" UUID;

-- AlterTable
ALTER TABLE "Major" DROP COLUMN "name",
ADD COLUMN     "name" "MajorEnum" NOT NULL;

-- DropTable
DROP TABLE "OptionalExam";

-- DropTable
DROP TABLE "SchoolOptionalExam";

-- CreateTable
CREATE TABLE "ElectiveExam" (
    "id" UUID NOT NULL,
    "name" "ElectiveExamEnum" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ElectiveExam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolElectiveExam" (
    "id" TEXT NOT NULL,
    "schoolId" UUID NOT NULL,
    "examId" UUID NOT NULL,
    "nbrClasses" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SchoolElectiveExam_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ElectiveExam_name_key" ON "ElectiveExam"("name");

-- CreateIndex
CREATE INDEX "Exam_term_subject_isOptional_idx" ON "Exam"("term", "subject", "isOptional");

-- CreateIndex
CREATE UNIQUE INDEX "Major_name_key" ON "Major"("name");

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_electiveExamId_fkey" FOREIGN KEY ("electiveExamId") REFERENCES "ElectiveExam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolMajors" ADD CONSTRAINT "SchoolMajors_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolMajors" ADD CONSTRAINT "SchoolMajors_majorId_fkey" FOREIGN KEY ("majorId") REFERENCES "Major"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolElectiveExam" ADD CONSTRAINT "SchoolElectiveExam_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolElectiveExam" ADD CONSTRAINT "SchoolElectiveExam_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;
