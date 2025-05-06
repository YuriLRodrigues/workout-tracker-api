-- DropForeignKey
ALTER TABLE "exercise" DROP CONSTRAINT "exercise_userId_fkey";

-- DropForeignKey
ALTER TABLE "exercise" DROP CONSTRAINT "exercise_workoutId_fkey";

-- DropForeignKey
ALTER TABLE "log" DROP CONSTRAINT "log_exerciseId_fkey";

-- DropForeignKey
ALTER TABLE "log" DROP CONSTRAINT "log_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "log" DROP CONSTRAINT "log_userId_fkey";

-- DropForeignKey
ALTER TABLE "plan" DROP CONSTRAINT "plan_userId_fkey";

-- DropForeignKey
ALTER TABLE "session" DROP CONSTRAINT "session_userId_fkey";

-- DropForeignKey
ALTER TABLE "session" DROP CONSTRAINT "session_workoutId_fkey";

-- DropForeignKey
ALTER TABLE "social_media" DROP CONSTRAINT "social_media_userId_fkey";

-- AlterTable
ALTER TABLE "log" ALTER COLUMN "exerciseId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "plan" ADD CONSTRAINT "plan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_media" ADD CONSTRAINT "social_media_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "workout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise" ADD CONSTRAINT "exercise_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "workout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise" ADD CONSTRAINT "exercise_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "log" ADD CONSTRAINT "log_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "log" ADD CONSTRAINT "log_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "log" ADD CONSTRAINT "log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
