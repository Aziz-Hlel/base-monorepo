/*
  Warnings:

  - A unique constraint covering the columns `[schoolId,uid]` on the table `students` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "SubjectCategory" AS ENUM ('ARABIC_LANGUAGE', 'SCIENCE_TECHNOLOGY', 'SOCIAL_EDUCATION', 'ART_EDUCATION', 'PHYSICAL_EDUCATION', 'FRENCH_LANGUAGE', 'ENGLISH_LANGUAGE');

-- CreateEnum
CREATE TYPE "Semester" AS ENUM ('FIRST', 'SECOND', 'THIRD');

-- CreateTable
CREATE TABLE "exams" (
    "id" UUID NOT NULL,
    "name_en" VARCHAR(255) NOT NULL,
    "name_fr" VARCHAR(255) NOT NULL,
    "name_ar" VARCHAR(255) NOT NULL,
    "category" "SubjectCategory" NOT NULL,
    "grade" "ClassGrade" NOT NULL,
    "schoolId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "examTimes" (
    "id" UUID NOT NULL,
    "examId" UUID NOT NULL,
    "classId" UUID NOT NULL,
    "semester" "Semester" NOT NULL,
    "day" DATE NOT NULL,
    "startTime" TIME NOT NULL,
    "endTime" TIME NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "examTimes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "exams_schoolId_name_en_grade_key" ON "exams"("schoolId", "name_en", "grade");

-- CreateIndex
CREATE UNIQUE INDEX "students_schoolId_uid_key" ON "students"("schoolId", "uid");

-- AddForeignKey
ALTER TABLE "exams" ADD CONSTRAINT "exams_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "examTimes" ADD CONSTRAINT "examTimes_examId_fkey" FOREIGN KEY ("examId") REFERENCES "exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "examTimes" ADD CONSTRAINT "examTimes_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classrooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
