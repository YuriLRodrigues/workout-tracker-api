/*
  Warnings:

  - Added the required column `color` to the `workout` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "workout" ADD COLUMN     "color" TEXT NOT NULL;
