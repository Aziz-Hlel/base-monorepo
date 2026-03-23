-- CreateEnum
CREATE TYPE "NotificationRecipientType" AS ENUM ('ALL', 'COUNTRY', 'ROLE', 'USER');

-- CreateEnum
CREATE TYPE "NotificationScheduleType" AS ENUM ('SCHEDULED', 'DELAYED');

-- CreateEnum
CREATE TYPE "NotificationLanguage" AS ENUM ('en', 'ar', 'fr');

-- CreateTable
CREATE TABLE "NotificationTranslation" (
    "id" TEXT NOT NULL,
    "language" "NotificationLanguage" NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "notificationId" TEXT NOT NULL,

    CONSTRAINT "NotificationTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "recipientType" "NotificationRecipientType" NOT NULL,
    "scheduleType" "NotificationScheduleType" NOT NULL,
    "delaySeconds" INTEGER,
    "scheduledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NotificationTranslation_notificationId_language_key" ON "NotificationTranslation"("notificationId", "language");

-- AddForeignKey
ALTER TABLE "NotificationTranslation" ADD CONSTRAINT "NotificationTranslation_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
