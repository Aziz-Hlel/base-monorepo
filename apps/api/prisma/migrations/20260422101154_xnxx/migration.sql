/*
  Warnings:

  - A unique constraint covering the columns `[schoolId,classroomId,subjectId]` on the table `assignments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `schoolId` to the `assignments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `schoolId` to the `timetable` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "assignments_subjectId_classroomId_teacherId_key";

-- AlterTable
ALTER TABLE "assignments" ADD COLUMN     "schoolId" UUID NOT NULL,
ALTER COLUMN "teacherId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "timetable" ADD COLUMN     "schoolId" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "assignments_schoolId_classroomId_subjectId_key" ON "assignments"("schoolId", "classroomId", "subjectId");

-- CreateIndex
CREATE INDEX "timetable_schoolId_assignmentId_idx" ON "timetable"("schoolId", "assignmentId");

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timetable" ADD CONSTRAINT "timetable_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;
