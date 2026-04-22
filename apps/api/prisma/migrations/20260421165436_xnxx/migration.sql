/*
  Warnings:

  - A unique constraint covering the columns `[schoolId,grade,name_en]` on the table `subjects` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[schoolId,grade,name_fr]` on the table `subjects` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[schoolId,grade,name_ar]` on the table `subjects` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "subjects_schoolId_grade_name_en_key" ON "subjects"("schoolId", "grade", "name_en");

-- CreateIndex
CREATE UNIQUE INDEX "subjects_schoolId_grade_name_fr_key" ON "subjects"("schoolId", "grade", "name_fr");

-- CreateIndex
CREATE UNIQUE INDEX "subjects_schoolId_grade_name_ar_key" ON "subjects"("schoolId", "grade", "name_ar");
