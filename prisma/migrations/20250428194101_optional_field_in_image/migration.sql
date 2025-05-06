-- DropForeignKey
ALTER TABLE "image" DROP CONSTRAINT "image_workoutId_fkey";

-- AlterTable
ALTER TABLE "image" ALTER COLUMN "workoutId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "image" ADD CONSTRAINT "image_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "workout"("id") ON DELETE SET NULL ON UPDATE CASCADE;
