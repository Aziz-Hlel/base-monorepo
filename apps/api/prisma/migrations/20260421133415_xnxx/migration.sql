/*
  Warnings:

  - You are about to drop the `subjectClassroomDetails` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subjectSessions` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `domain` to the `subjects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hoursPerWeek` to the `subjects` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SubjectDomain" AS ENUM ('ARABIC_LANGUAGE', 'SCIENCE_TECHNOLOGY', 'SOCIAL_EDUCATION', 'ART_EDUCATION', 'PHYSICAL_EDUCATION', 'FRENCH_LANGUAGE', 'ENGLISH_LANGUAGE');

-- DropForeignKey
ALTER TABLE "subjectClassroomDetails" DROP CONSTRAINT "subjectClassroomDetails_classroomId_fkey";

-- DropForeignKey
ALTER TABLE "subjectClassroomDetails" DROP CONSTRAINT "subjectClassroomDetails_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "subjectClassroomDetails" DROP CONSTRAINT "subjectClassroomDetails_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "subjectSessions" DROP CONSTRAINT "subjectSessions_subjectClassroomId_fkey";

-- AlterTable
ALTER TABLE "subjects" ADD COLUMN     "domain" "SubjectDomain" NOT NULL,
ADD COLUMN     "hoursPerWeek" SMALLINT NOT NULL;

-- DropTable
DROP TABLE "subjectClassroomDetails";

-- DropTable
DROP TABLE "subjectSessions";

-- CreateTable
CREATE TABLE "assignments" (
    "id" UUID NOT NULL,
    "subjectId" UUID NOT NULL,
    "classroomId" UUID NOT NULL,
    "teacherId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timetable" (
    "id" UUID NOT NULL,
    "assignmentId" UUID NOT NULL,
    "day" "DayOfWeek" NOT NULL,
    "startTime" TIME NOT NULL,
    "endTime" TIME NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "timetable_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "assignments_subjectId_classroomId_teacherId_key" ON "assignments"("subjectId", "classroomId", "teacherId");

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "classrooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timetable" ADD CONSTRAINT "timetable_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "assignments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
