/*
  Warnings:

  - Made the column `examId` on table `ExamSession` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ExamSession" DROP CONSTRAINT "ExamSession_examId_fkey";

-- AlterTable
ALTER TABLE "ExamSession" ALTER COLUMN "examId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "ExamSession" ADD CONSTRAINT "ExamSession_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
