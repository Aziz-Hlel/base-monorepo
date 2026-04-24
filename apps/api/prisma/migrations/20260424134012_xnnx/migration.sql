/*
  Warnings:

  - You are about to drop the column `durationInMinutes` on the `exams` table. All the data in the column will be lost.
  - Added the required column `durationInMin` to the `exams` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "exams" DROP COLUMN "durationInMinutes",
ADD COLUMN     "durationInMin" SMALLINT NOT NULL;
