/*
  Warnings:

  - The values [OWNER] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `schoolId` on the `school_owner` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `school_owner` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[accountId]` on the table `school_owner` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ownerId]` on the table `schools` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `accountId` to the `school_owner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerId` to the `schools` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('DIRECTOR', 'MANAGER', 'TEACHER', 'PARENT', 'NURSE', 'DRIVER');
ALTER TABLE "public"."user_roles" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "user_roles" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "public"."UserRole_old";
ALTER TABLE "user_roles" ALTER COLUMN "role" SET DEFAULT 'PARENT';
COMMIT;

-- DropForeignKey
ALTER TABLE "school_owner" DROP CONSTRAINT "school_owner_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "school_owner" DROP CONSTRAINT "school_owner_userId_fkey";

-- DropIndex
DROP INDEX "school_owner_schoolId_key";

-- DropIndex
DROP INDEX "school_owner_userId_key";

-- AlterTable
ALTER TABLE "school_owner" DROP COLUMN "schoolId",
DROP COLUMN "userId",
ADD COLUMN     "accountId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "schools" ADD COLUMN     "ownerId" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "school_owner_accountId_key" ON "school_owner"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "schools_ownerId_key" ON "schools"("ownerId");

-- AddForeignKey
ALTER TABLE "school_owner" ADD CONSTRAINT "school_owner_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schools" ADD CONSTRAINT "schools_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "school_owner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
