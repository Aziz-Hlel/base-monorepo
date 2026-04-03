/*
  Warnings:

  - You are about to drop the column `arName` on the `schools` table. All the data in the column will be lost.
  - You are about to drop the column `enName` on the `schools` table. All the data in the column will be lost.
  - You are about to drop the column `frName` on the `schools` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `school_owner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `school_owner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `school_owner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameAr` to the `schools` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameEn` to the `schools` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameFr` to the `schools` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "school_owner" ADD COLUMN     "firstName" VARCHAR(255) NOT NULL,
ADD COLUMN     "lastName" VARCHAR(255) NOT NULL,
ADD COLUMN     "phoneNumber" VARCHAR(20) NOT NULL;

-- AlterTable
ALTER TABLE "schools" DROP COLUMN "arName",
DROP COLUMN "enName",
DROP COLUMN "frName",
ADD COLUMN     "nameAr" VARCHAR(255) NOT NULL,
ADD COLUMN     "nameEn" VARCHAR(255) NOT NULL,
ADD COLUMN     "nameFr" VARCHAR(255) NOT NULL;
