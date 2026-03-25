/*
  Warnings:

  - You are about to drop the column `title` on the `Notification` table. All the data in the column will be lost.
  - The `data` column on the `NotificationTranslation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `NotificationRecipient` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `createdById` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `recipientType` on the `Notification` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `scheduleType` on the `Notification` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "NotificationRecipientType" AS ENUM ('ALL', 'COUNTRY', 'ROLE', 'USER');

-- CreateEnum
CREATE TYPE "NotificationScheduleType" AS ENUM ('SCHEDULED', 'DELAYED');

-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('PENDING', 'SENT', 'DELIVERED', 'READ', 'FAILED');

-- DropForeignKey
ALTER TABLE "NotificationRecipient" DROP CONSTRAINT "NotificationRecipient_notificationId_fkey";

-- DropForeignKey
ALTER TABLE "NotificationRecipient" DROP CONSTRAINT "NotificationRecipient_recipientId_fkey";

-- DropForeignKey
ALTER TABLE "NotificationTranslation" DROP CONSTRAINT "NotificationTranslation_notificationId_fkey";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "title",
ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "sentAt" TIMESTAMP(3),
DROP COLUMN "recipientType",
ADD COLUMN     "recipientType" "NotificationRecipientType" NOT NULL,
DROP COLUMN "scheduleType",
ADD COLUMN     "scheduleType" "NotificationScheduleType" NOT NULL;

-- AlterTable
ALTER TABLE "NotificationTranslation" DROP COLUMN "data",
ADD COLUMN     "data" JSONB;

-- DropTable
DROP TABLE "NotificationRecipient";

-- DropEnum
DROP TYPE "NotificationRecipientEnum";

-- DropEnum
DROP TYPE "NotificationScheduleEnum";

-- CreateTable
CREATE TABLE "NotificationTargeting" (
    "id" TEXT NOT NULL,
    "notificationId" TEXT NOT NULL,
    "countries" TEXT[],
    "roles" "Role"[],

    CONSTRAINT "NotificationTargeting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationTargetUser" (
    "id" TEXT NOT NULL,
    "targetingId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "NotificationTargetUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationDelivery" (
    "id" TEXT NOT NULL,
    "notificationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "DeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "sentAt" TIMESTAMP(3),
    "readAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NotificationDelivery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NotificationTargeting_notificationId_key" ON "NotificationTargeting"("notificationId");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationTargetUser_targetingId_userId_key" ON "NotificationTargetUser"("targetingId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationDelivery_notificationId_userId_key" ON "NotificationDelivery"("notificationId", "userId");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationTranslation" ADD CONSTRAINT "NotificationTranslation_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationTargeting" ADD CONSTRAINT "NotificationTargeting_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationTargetUser" ADD CONSTRAINT "NotificationTargetUser_targetingId_fkey" FOREIGN KEY ("targetingId") REFERENCES "NotificationTargeting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationTargetUser" ADD CONSTRAINT "NotificationTargetUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationDelivery" ADD CONSTRAINT "NotificationDelivery_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationDelivery" ADD CONSTRAINT "NotificationDelivery_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
