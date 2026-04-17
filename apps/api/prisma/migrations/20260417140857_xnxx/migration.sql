/*
  Warnings:

  - You are about to drop the column `phone` on the `parents` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "parents" DROP COLUMN "phone",
ADD COLUMN     "emergencyPhone" VARCHAR(20);
