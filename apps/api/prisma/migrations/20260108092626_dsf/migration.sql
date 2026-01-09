/*
  Warnings:

  - You are about to drop the column `mediaId` on the `Product` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[thumbnailId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_mediaId_fkey";

-- DropIndex
DROP INDEX "Product_mediaId_key";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "mediaId",
ADD COLUMN     "thumbnailId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Product_thumbnailId_key" ON "Product"("thumbnailId");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_thumbnailId_fkey" FOREIGN KEY ("thumbnailId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
