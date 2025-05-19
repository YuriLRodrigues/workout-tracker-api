/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "MuscleType" ADD VALUE 'GLUTES';
ALTER TYPE "MuscleType" ADD VALUE 'HAMSTRINGS';
ALTER TYPE "MuscleType" ADD VALUE 'QUADRICEPS';
ALTER TYPE "MuscleType" ADD VALUE 'ADDUCTORS_ABDUCTORS';

-- DropIndex
DROP INDEX "workout_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "user_id_key" ON "user"("id");
