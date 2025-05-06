/*
  Warnings:

  - Added the required column `userId` to the `log` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "log" DROP CONSTRAINT "log_sessionId_fkey";

-- AlterTable
ALTER TABLE "log" ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "sessionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "log" ADD CONSTRAINT "log_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "session"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "log" ADD CONSTRAINT "log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
