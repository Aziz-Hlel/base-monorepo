/*
  Warnings:

  - You are about to drop the `classSessions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `examSessions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `examTimes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `exams` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `extraCurricularSessions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "classSessions" DROP CONSTRAINT "classSessions_classId_fkey";

-- DropForeignKey
ALTER TABLE "classSessions" DROP CONSTRAINT "classSessions_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "examSessions" DROP CONSTRAINT "examSessions_classId_fkey";

-- DropForeignKey
ALTER TABLE "examSessions" DROP CONSTRAINT "examSessions_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "examTimes" DROP CONSTRAINT "examTimes_classId_fkey";

-- DropForeignKey
ALTER TABLE "examTimes" DROP CONSTRAINT "examTimes_examId_fkey";

-- DropForeignKey
ALTER TABLE "exams" DROP CONSTRAINT "exams_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "extraCurricularSessions" DROP CONSTRAINT "extraCurricularSessions_teacherId_fkey";

-- DropTable
DROP TABLE "classSessions";

-- DropTable
DROP TABLE "examSessions";

-- DropTable
DROP TABLE "examTimes";

-- DropTable
DROP TABLE "exams";

-- DropTable
DROP TABLE "extraCurricularSessions";

-- DropEnum
DROP TYPE "SubjectCategory";

-- CreateTable
CREATE TABLE "subjects" (
    "id" UUID NOT NULL,
    "name_en" VARCHAR(255) NOT NULL,
    "name_fr" VARCHAR(255) NOT NULL,
    "name_ar" VARCHAR(255) NOT NULL,
    "grade" "ClassGrade" NOT NULL,
    "schoolId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subjectClassroomDetails" (
    "id" UUID NOT NULL,
    "subjectId" UUID NOT NULL,
    "classroomId" UUID NOT NULL,
    "teacherId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subjectClassroomDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subjectSessions" (
    "id" UUID NOT NULL,
    "subjectClassroomId" UUID NOT NULL,
    "day" "DayOfWeek" NOT NULL,
    "startTime" TIME NOT NULL,
    "endTime" TIME NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subjectSessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subjects_schoolId_grade_name_en_key" ON "subjects"("schoolId", "grade", "name_en");

-- CreateIndex
CREATE UNIQUE INDEX "subjectClassroomDetails_subjectId_classroomId_teacherId_key" ON "subjectClassroomDetails"("subjectId", "classroomId", "teacherId");

-- AddForeignKey
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subjectClassroomDetails" ADD CONSTRAINT "subjectClassroomDetails_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subjectClassroomDetails" ADD CONSTRAINT "subjectClassroomDetails_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "classrooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subjectClassroomDetails" ADD CONSTRAINT "subjectClassroomDetails_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subjectSessions" ADD CONSTRAINT "subjectSessions_subjectClassroomId_fkey" FOREIGN KEY ("subjectClassroomId") REFERENCES "subjectClassroomDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;
