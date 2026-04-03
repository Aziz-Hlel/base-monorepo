/*
  Warnings:

  - You are about to drop the `directors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `drivers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `managers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `nurses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `owners` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[schoolId,id]` on the table `students` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "directors" DROP CONSTRAINT "directors_userId_fkey";

-- DropForeignKey
ALTER TABLE "drivers" DROP CONSTRAINT "drivers_userId_fkey";

-- DropForeignKey
ALTER TABLE "managers" DROP CONSTRAINT "managers_userId_fkey";

-- DropForeignKey
ALTER TABLE "nurses" DROP CONSTRAINT "nurses_userId_fkey";

-- DropForeignKey
ALTER TABLE "owners" DROP CONSTRAINT "owners_userId_fkey";

-- DropIndex
DROP INDEX "students_schoolId_key";

-- DropTable
DROP TABLE "directors";

-- DropTable
DROP TABLE "drivers";

-- DropTable
DROP TABLE "managers";

-- DropTable
DROP TABLE "nurses";

-- DropTable
DROP TABLE "owners";

-- CreateIndex
CREATE UNIQUE INDEX "students_schoolId_id_key" ON "students"("schoolId", "id");
