/*
  Warnings:

  - You are about to drop the column `name` on the `ExamSession` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ExamSession" DROP CONSTRAINT "ExamSession_classId_fkey";

-- DropForeignKey
ALTER TABLE "ExamSession" DROP CONSTRAINT "ExamSession_examId_fkey";

-- AlterTable
ALTER TABLE "ExamSession" DROP COLUMN "name";

-- AddForeignKey
ALTER TABLE "ExamSession" ADD CONSTRAINT "ExamSession_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamSession" ADD CONSTRAINT "ExamSession_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;
