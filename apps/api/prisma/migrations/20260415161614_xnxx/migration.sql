/*
  Warnings:

  - Added the required column `status` to the `students` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StudentStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'EXPELLED');

-- AlterTable
ALTER TABLE "students" ADD COLUMN     "classId" UUID,
ADD COLUMN     "status" "StudentStatus" NOT NULL;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
