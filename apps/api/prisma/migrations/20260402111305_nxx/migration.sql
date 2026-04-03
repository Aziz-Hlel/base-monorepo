/*
  Warnings:

  - You are about to drop the column `ownerId` on the `schools` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "schools" DROP CONSTRAINT "schools_ownerId_fkey";

-- DropIndex
DROP INDEX "schools_ownerId_key";

-- AlterTable
ALTER TABLE "schools" DROP COLUMN "ownerId";

-- CreateTable
CREATE TABLE "school_owner" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "schoolId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "school_owner_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "school_owner_userId_key" ON "school_owner"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "school_owner_schoolId_key" ON "school_owner"("schoolId");

-- AddForeignKey
ALTER TABLE "school_owner" ADD CONSTRAINT "school_owner_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "school_owner" ADD CONSTRAINT "school_owner_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
