/*
  Warnings:

  - You are about to drop the `parent_students` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "parent_students" DROP CONSTRAINT "parent_students_parentId_fkey";

-- DropForeignKey
ALTER TABLE "parent_students" DROP CONSTRAINT "parent_students_studentId_fkey";

-- DropTable
DROP TABLE "parent_students";

-- CreateTable
CREATE TABLE "student_parents" (
    "id" UUID NOT NULL,
    "parentId" UUID NOT NULL,
    "studentId" UUID NOT NULL,

    CONSTRAINT "student_parents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "student_parents_parentId_studentId_key" ON "student_parents"("parentId", "studentId");

-- AddForeignKey
ALTER TABLE "student_parents" ADD CONSTRAINT "student_parents_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "parents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_parents" ADD CONSTRAINT "student_parents_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;
