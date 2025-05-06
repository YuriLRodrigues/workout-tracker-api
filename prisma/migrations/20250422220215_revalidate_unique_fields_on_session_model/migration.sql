/*
  Warnings:

  - A unique constraint covering the columns `[workoutId,id]` on the table `session` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "session_workoutId_id_key" ON "session"("workoutId", "id");
