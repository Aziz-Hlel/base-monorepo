-- DropForeignKey
ALTER TABLE "assignments" DROP CONSTRAINT "assignments_teacherId_fkey";

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teachers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
