-- CreateTable
CREATE TABLE "exams" (
    "id" UUID NOT NULL,
    "name_en" VARCHAR(255) NOT NULL,
    "name_fr" VARCHAR(255) NOT NULL,
    "name_ar" VARCHAR(255) NOT NULL,
    "durationInMinutes" SMALLINT NOT NULL,
    "subjectId" UUID NOT NULL,
    "schoolId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exams_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "exams_schoolId_subjectId_name_en_key" ON "exams"("schoolId", "subjectId", "name_en");

-- CreateIndex
CREATE UNIQUE INDEX "exams_schoolId_subjectId_name_fr_key" ON "exams"("schoolId", "subjectId", "name_fr");

-- CreateIndex
CREATE UNIQUE INDEX "exams_schoolId_subjectId_name_ar_key" ON "exams"("schoolId", "subjectId", "name_ar");

-- AddForeignKey
ALTER TABLE "exams" ADD CONSTRAINT "exams_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exams" ADD CONSTRAINT "exams_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;
