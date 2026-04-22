/*
  Warnings:

  - A unique constraint covering the columns `[schoolId,name,grade]` on the table `classrooms` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "classrooms_schoolId_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "classrooms_schoolId_name_grade_key" ON "classrooms"("schoolId", "name", "grade");
