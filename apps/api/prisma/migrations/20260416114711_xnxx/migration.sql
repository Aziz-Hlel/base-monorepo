/*
  Warnings:

  - You are about to drop the column `firstName` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `students` table. All the data in the column will be lost.
  - You are about to drop the `classes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "classSessions" DROP CONSTRAINT "classSessions_classId_fkey";

-- DropForeignKey
ALTER TABLE "classes" DROP CONSTRAINT "classes_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "examSessions" DROP CONSTRAINT "examSessions_classId_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_classId_fkey";

-- AlterTable
ALTER TABLE "students" DROP COLUMN "firstName",
DROP COLUMN "lastName",
ADD COLUMN     "firstName_ar" VARCHAR(255),
ADD COLUMN     "firstName_en" VARCHAR(255),
ADD COLUMN     "lastName_ar" VARCHAR(255),
ADD COLUMN     "lastName_en" VARCHAR(255),
ADD COLUMN     "uid" VARCHAR(50),
ALTER COLUMN "dateOfBirth" DROP NOT NULL;

-- DropTable
DROP TABLE "classes";

-- CreateTable
CREATE TABLE "classrooms" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "grade" "ClassGrade" NOT NULL,
    "schoolId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "classrooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_profiles" (
    "id" UUID NOT NULL,
    "healthInfo" TEXT,
    "vaccine" TEXT,
    "cpr" TEXT,
    "allergies" TEXT,
    "notes" TEXT,
    "emergencyContactName1" TEXT,
    "emergencyContactPhone1" TEXT,
    "emergencyContactRelation1" TEXT,
    "emergencyContactName2" TEXT,
    "emergencyContactPhone2" TEXT,
    "emergencyContactRelation2" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "classrooms_schoolId_name_key" ON "classrooms"("schoolId", "name");

-- AddForeignKey
ALTER TABLE "classrooms" ADD CONSTRAINT "classrooms_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_profiles" ADD CONSTRAINT "student_profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classrooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classSessions" ADD CONSTRAINT "classSessions_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classrooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "examSessions" ADD CONSTRAINT "examSessions_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classrooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
