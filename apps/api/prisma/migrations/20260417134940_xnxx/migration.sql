/*
  Warnings:

  - You are about to drop the column `emergencyPhone` on the `parents` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "parents" DROP COLUMN "emergencyPhone",
ADD COLUMN     "phone" VARCHAR(20);
