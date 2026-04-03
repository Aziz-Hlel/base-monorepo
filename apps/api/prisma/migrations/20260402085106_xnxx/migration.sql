/*
  Warnings:

  - You are about to drop the column `name` on the `schools` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `schools` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `arName` to the `schools` table without a default value. This is not possible if the table is not empty.
  - Added the required column `enName` to the `schools` table without a default value. This is not possible if the table is not empty.
  - Added the required column `frName` to the `schools` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `schools` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "schools" DROP COLUMN "name",
ADD COLUMN     "arName" VARCHAR(255) NOT NULL,
ADD COLUMN     "enName" VARCHAR(255) NOT NULL,
ADD COLUMN     "frName" VARCHAR(255) NOT NULL,
ADD COLUMN     "slug" VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "schools_slug_key" ON "schools"("slug");
