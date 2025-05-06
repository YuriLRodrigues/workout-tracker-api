import { Module } from '@nestjs/common';
import { ExerciseRepository } from '@root/domain/application/repositories/exercise.repository';
import { ImageRepository } from '@root/domain/application/repositories/image.repository';
import { LogRepository } from '@root/domain/application/repositories/log.repository';
import { SessionRepository } from '@root/domain/application/repositories/session.repository';
import { WorkoutRepository } from '@root/domain/application/repositories/workout.repository';
import { UserRepository } from 'src/domain/application/repositories/user.repository';

import { PrismaService } from './prisma.service';
import { PrismaExerciseRepository } from './repositories/prisma-exercise-repository';
import { PrismaImageRepository } from './repositories/prisma-image-repository';
import { PrismaLogRepository } from './repositories/prisma-log-repository';
import { PrismaSessionRepository } from './repositories/prisma-session-repository';
import { PrismaUserRepository } from './repositories/prisma-user-repository';
import { PrismaWorkoutRepository } from './repositories/prisma-workout-repository';

@Module({
  providers: [
    PrismaService,
    { provide: UserRepository, useClass: PrismaUserRepository },
    { provide: ImageRepository, useClass: PrismaImageRepository },
    { provide: WorkoutRepository, useClass: PrismaWorkoutRepository },
    { provide: ExerciseRepository, useClass: PrismaExerciseRepository },
    { provide: LogRepository, useClass: PrismaLogRepository },
    { provide: SessionRepository, useClass: PrismaSessionRepository },
  ],
  exports: [
    PrismaService,
    UserRepository,
    ImageRepository,
    WorkoutRepository,
    ExerciseRepository,
    LogRepository,
    SessionRepository,
  ],
})
export class DatabaseModule {}
