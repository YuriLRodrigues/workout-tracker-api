/*
  Warnings:

  - A unique constraint covering the columns `[userId,id]` on the table `image` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "image_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "image_userId_id_key" ON "image"("userId", "id");
