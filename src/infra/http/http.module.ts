import { Module } from '@nestjs/common';
import { ExerciseUseCasesModule } from '@root/domain/application/use-cases/exercise/exercise.use-cases.module';
import { ImageUseCasesModule } from '@root/domain/application/use-cases/image/image-use-cases.module';
import { LogUseCasesModule } from '@root/domain/application/use-cases/log/log.use-cases.module';
import { SessionUseCasesModule } from '@root/domain/application/use-cases/session/session.use-cases.module';
import { WorkoutUseCasesModule } from '@root/domain/application/use-cases/workout/workout.use-cases.module';
import { UserUseCasesModule } from 'src/domain/application/use-cases/user/user.use-cases.module';

import { CreateExerciseController } from './controller/exercise/create.controller';
import { DeleteExerciseController } from './controller/exercise/delete.controller';
import { FindAllExercisesByWorkoutIdController } from './controller/exercise/find-all-by-workout-id.controller';
import { FindExerciseByIdController } from './controller/exercise/find-by-id.controller';
import { DeleteImageController } from './controller/image/delete.controller';
import { UpdateImageController } from './controller/image/update.controller';
import { UploadImageController } from './controller/image/upload.controller';
import { CreateLogController } from './controller/log/create.controller';
import { DeleteLogController } from './controller/log/delete.controller';
import { FindAllLogsByExerciseIdController } from './controller/log/find-all-by-exercise-id.controller';
import { FindAllLogsTodayController } from './controller/log/find-all-logs-today.controller';
import { FindLogTodayByExerciseIdUseCaseController } from './controller/log/find-today-by-exercise-id.controller';
import { CreateSessionController } from './controller/session/create.controller';
import { FindAllByUserIdController } from './controller/session/find-all-by-user-id.controller';
import { FindAverageTimeByWeekController } from './controller/session/find-average-time-by-week.controller';
import { FindAverageWorkoutByWeekController } from './controller/session/find-average-workout-by-week.controller';
import { FindFrequencyByWeekAndUserIdController } from './controller/session/find-frequency-by-week-and-user-id.controller';
import { FindSessionTodayByWorkoutIdController } from './controller/session/find-today-by-workout-id.controller';
import { FindTotalLoadByWeekController } from './controller/session/find-total-load-by-week.controller';
import { FindTotalSeriesByWeekController } from './controller/session/find-total-series-by-week.controller';
import { UpdateSessionController } from './controller/session/update.controller';
import { DeleteUserController } from './controller/user/delete.controller';
import { MeController } from './controller/user/me.controller';
import { SignInController } from './controller/user/sign-in.controller';
import { SignUpController } from './controller/user/sign-up.controller';
import { UpdateUserPersonalInfoController } from './controller/user/update-personal-info.controller';
import { CreateWorkoutController } from './controller/workout/create.controller';
import { DeleteWorkoutController } from './controller/workout/delete.controller';
import { FindAllWorkoutsByUserIdController } from './controller/workout/find-all-by-user-id.controller';
import { FindWorkoutByIdController } from './controller/workout/find-by-id.controller';
import { FindTotalAndAvgTimeByUserIdController } from './controller/workout/find-total-and-avg-time-by-user-id.controller';
import { FindTotalWorkoutsCountByUserIdController } from './controller/workout/find-total-count-by-user-id.controller';

@Module({
  imports: [
    UserUseCasesModule,
    ImageUseCasesModule,
    WorkoutUseCasesModule,
    ExerciseUseCasesModule,
    LogUseCasesModule,
    SessionUseCasesModule,
  ],
  controllers: [
    // User
    DeleteUserController,
    MeController,
    SignInController,
    SignUpController,
    UpdateUserPersonalInfoController,

    // Image
    UploadImageController,
    DeleteImageController,
    UpdateImageController,

    // Workout
    CreateWorkoutController,
    DeleteWorkoutController,
    FindAllWorkoutsByUserIdController,
    FindWorkoutByIdController,
    FindTotalAndAvgTimeByUserIdController,
    FindTotalWorkoutsCountByUserIdController,

    // Exercise
    CreateExerciseController,
    DeleteExerciseController,
    FindAllExercisesByWorkoutIdController,
    FindExerciseByIdController,

    // Log
    CreateLogController,
    DeleteLogController,
    FindAllLogsByExerciseIdController,
    FindAllLogsTodayController,
    FindLogTodayByExerciseIdUseCaseController,

    // Session
    CreateSessionController,
    FindSessionTodayByWorkoutIdController,
    UpdateSessionController,
    FindAverageTimeByWeekController,
    FindAverageWorkoutByWeekController,
    FindTotalLoadByWeekController,
    FindTotalSeriesByWeekController,
    FindAllByUserIdController,
    FindFrequencyByWeekAndUserIdController,
  ],
})
export class HttpModule {}
