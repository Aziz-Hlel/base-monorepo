/*
  Warnings:

  - A unique constraint covering the columns `[classId,examId]` on the table `ExamSession` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ExamSession_classId_examId_key" ON "ExamSession"("classId", "examId");
