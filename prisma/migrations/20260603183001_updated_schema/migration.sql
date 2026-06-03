/*
  Warnings:

  - You are about to drop the column `placement` on the `College` table. All the data in the column will be lost.
  - Added the required column `establishedYear` to the `College` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownership` to the `College` table without a default value. This is not possible if the table is not empty.
  - Added the required column `placementScore` to the `College` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shortName` to the `College` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `College` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `College` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ExamType" AS ENUM ('MHT_CET', 'JEE_MAIN');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('OPEN', 'OBC', 'EWS', 'SC', 'ST');

-- AlterTable
ALTER TABLE "College" DROP COLUMN "placement",
ADD COLUMN     "establishedYear" INTEGER NOT NULL,
ADD COLUMN     "nirfRank" INTEGER,
ADD COLUMN     "ownership" TEXT NOT NULL,
ADD COLUMN     "placementScore" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "shortName" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "website" TEXT;

-- CreateTable
CREATE TABLE "Course" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "seats" INTEGER NOT NULL,
    "collegeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cutoff" (
    "id" SERIAL NOT NULL,
    "examType" "ExamType" NOT NULL,
    "category" "Category" NOT NULL,
    "branch" TEXT NOT NULL,
    "cutoffScore" DOUBLE PRECISION NOT NULL,
    "year" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cutoff_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Course_collegeId_idx" ON "Course"("collegeId");

-- CreateIndex
CREATE INDEX "Course_name_idx" ON "Course"("name");

-- CreateIndex
CREATE INDEX "Cutoff_courseId_idx" ON "Cutoff"("courseId");

-- CreateIndex
CREATE INDEX "Cutoff_examType_category_year_idx" ON "Cutoff"("examType", "category", "year");

-- CreateIndex
CREATE INDEX "College_state_idx" ON "College"("state");

-- CreateIndex
CREATE INDEX "College_type_idx" ON "College"("type");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cutoff" ADD CONSTRAINT "Cutoff_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
