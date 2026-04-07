/*
  Warnings:

  - A unique constraint covering the columns `[accountId,schoolId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "users_accountId_schoolId_idx";

-- CreateIndex
CREATE UNIQUE INDEX "users_accountId_schoolId_key" ON "users"("accountId", "schoolId");
