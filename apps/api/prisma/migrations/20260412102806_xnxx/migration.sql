/*
  Warnings:

  - The values [YAOUNDE,DOUALA,BAMENDA,MAROUA,GAROUA,KUMBO] on the enum `CityEnum` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `School` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `School` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CityEnum_new" AS ENUM ('SOUSSE', 'TUNIS', 'SFAX', 'BIZERTE', 'KAIROUAN', 'GABES', 'MONASTIR', 'NABEUL', 'BEJA', 'JENDOUBA', 'KEF', 'SILIANA', 'KASSERINE', 'TOZEUR', 'GAFSA', 'MEDENINE', 'TATAOUINE', 'ZAGHOUAN', 'MANOUBA', 'ARIANA', 'BEN_AROUS');
ALTER TABLE "School" ALTER COLUMN "city" TYPE "CityEnum_new" USING ("city"::text::"CityEnum_new");
ALTER TYPE "CityEnum" RENAME TO "CityEnum_old";
ALTER TYPE "CityEnum_new" RENAME TO "CityEnum";
DROP TYPE "public"."CityEnum_old";
COMMIT;

-- AlterTable
ALTER TABLE "School" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "School_userId_key" ON "School"("userId");

-- AddForeignKey
ALTER TABLE "School" ADD CONSTRAINT "School_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
