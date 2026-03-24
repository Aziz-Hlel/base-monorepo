/*
  Warnings:

  - Changed the type of `recipientType` on the `Notification` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `scheduleType` on the `Notification` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "NotificationRecipientEnum" AS ENUM ('ALL', 'COUNTRY', 'ROLE', 'USER');

-- CreateEnum
CREATE TYPE "NotificationScheduleEnum" AS ENUM ('SCHEDULED', 'DELAYED');

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "recipientType",
ADD COLUMN     "recipientType" "NotificationRecipientEnum" NOT NULL,
DROP COLUMN "scheduleType",
ADD COLUMN     "scheduleType" "NotificationScheduleEnum" NOT NULL;

-- DropEnum
DROP TYPE "NotificationRecipientType";

-- DropEnum
DROP TYPE "NotificationScheduleType";
