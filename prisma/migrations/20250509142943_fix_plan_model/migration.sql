/*
  Warnings:

  - You are about to drop the column `duration` on the `plan` table. All the data in the column will be lost.
  - Added the required column `expiresAt` to the `plan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "plan" DROP COLUMN "duration",
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL;
