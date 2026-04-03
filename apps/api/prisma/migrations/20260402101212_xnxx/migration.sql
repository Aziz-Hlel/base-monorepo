/*
  Warnings:

  - A unique constraint covering the columns `[ownerId]` on the table `schools` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ownerId` to the `schools` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "schools" ADD COLUMN     "ownerId" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "schools_ownerId_key" ON "schools"("ownerId");

-- AddForeignKey
ALTER TABLE "schools" ADD CONSTRAINT "schools_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
