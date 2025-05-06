-- DropForeignKey
ALTER TABLE "image" DROP CONSTRAINT "image_exerciseId_fkey";

-- AlterTable
ALTER TABLE "image" ALTER COLUMN "exerciseId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "image" ADD CONSTRAINT "image_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "exercise"("id") ON DELETE SET NULL ON UPDATE CASCADE;
