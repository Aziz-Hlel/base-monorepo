/*
  Warnings:

  - You are about to drop the column `userId` on the `NotificationDelivery` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "NotificationDelivery" DROP CONSTRAINT "NotificationDelivery_userId_fkey";

-- DropIndex
DROP INDEX "NotificationDelivery_notificationId_userId_key";

-- AlterTable
ALTER TABLE "NotificationDelivery" DROP COLUMN "userId";
