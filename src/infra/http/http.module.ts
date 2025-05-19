import { Module } from '@nestjs/common';
import { ExerciseUseCasesModule } from '@root/domain/application/use-cases/exercise/exercise.use-cases.module';
import { ImageUseCasesModule } from '@root/domain/application/use-cases/image/image-use-cases.module';
import { LogUseCasesModule } from '@root/domain/application/use-cases/log/log.use-cases.module';
import { PhysicalUseCasesModule } from '@root/domain/application/use-cases/physical/physical.use-cases.module';
import { SessionUseCasesModule } from '@root/domain/application/use-cases/session/session.use-cases.module';
import { WorkoutUseCasesModule } from '@root/domain/application/use-cases/workout/workout.use-cases.module';
import { UserUseCasesModule } from 'src/domain/application/use-cases/user/user.use-cases.module';

import { DatabaseModule } from '../database/database.module';
import { CreateExerciseController } from './controller/exercise/create.controller';
import { DeleteExerciseController } from './controller/exercise/delete.controller';
import { FindAllExercisesByWorkoutIdController } from './controller/exercise/find-all-by-workout-id.controller';
import { FindExerciseByIdController } from './controller/exercise/find-by-id.controller';
import { UpdateExerciseController } from './controller/exercise/update.controller';
import { DeleteImageController } from './controller/image/delete.controller';
import { UpdateImageController } from './controller/image/update.controller';
import { UploadImageController } from './controller/image/upload.controller';
import { CreateLogController } from './controller/log/create.controller';
import { DeleteLogController } from './controller/log/delete.controller';
import { FindAllLogsByExerciseIdController } from './controller/log/find-all-by-exercise-id.controller';
import { FindAllLogsTodayController } from './controller/log/find-all-logs-today.controller';
import { FindLogTodayByExerciseIdUseCaseController } from './controller/log/find-today-by-exercise-id.controller';
import { CreatePhysicalController } from './controller/physical/create.controller';
import { FindPhysicalStatsByUserIdController } from './controller/physical/find-stats-by-user-id.controller';
import { UpdatePhysicalController } from './controller/physical/update.controller';
import { CreateSessionController } from './controller/session/create.controller';
import { FindAllByUserIdController } from './controller/session/find-all-by-user-id.controller';
import { FindAverageTimeByWeekController } from './controller/session/find-average-time-by-week.controller';
import { FindAverageWorkoutByWeekController } from './controller/session/find-average-workout-by-week.controller';
import { FindFrequencyByWeekAndUserIdController } from './controller/session/find-frequency-by-week-and-user-id.controller';
import { FindSessionTodayByWorkoutIdAndUserIdController } from './controller/session/find-today-by-workout-id-and-user-id.controller';
import { FindSessionTodayByWorkoutIdController } from './controller/session/find-today-by-workout-id.controller';
import { FindTotalLoadByWeekController } from './controller/session/find-total-load-by-week.controller';
import { FindTotalSeriesByWeekController } from './controller/session/find-total-series-by-week.controller';
import { UpdateSessionController } from './controller/session/update.controller';
import { ChangeMyUserPasswordController } from './controller/user/change-my-password.controller';
import { DeleteUserController } from './controller/user/delete.controller';
import { ForgotPasswordController } from './controller/user/forgot-password.controller';
import { MeController } from './controller/user/me.controller';
import { NewPasswordController } from './controller/user/new-password.controller';
import { SignInController } from './controller/user/sign-in.controller';
import { SignUpController } from './controller/user/sign-up.controller';
import { UpdateUserPersonalInfoController } from './controller/user/update-personal-info.controller';
import { CreateWorkoutController } from './controller/workout/create.controller';
import { DeleteWorkoutController } from './controller/workout/delete.controller';
import { FindAllWorkoutsByUserIdController } from './controller/workout/find-all-by-user-id.controller';
import { FindWorkoutByIdController } from './controller/workout/find-by-id.controller';
import { FindWorkoutsHistoryByUserIdController } from './controller/workout/find-history-by-user-id.controller';
import { FindTotalAndAvgTimeByUserIdController } from './controller/workout/find-total-and-avg-time-by-user-id.controller';
import { FindTotalWorkoutsCountByUserIdController } from './controller/workout/find-total-count-by-user-id.controller';
import { UpdateWorkoutController } from './controller/workout/update.controller';

@Module({
  imports: [
    UserUseCasesModule,
    ImageUseCasesModule,
    WorkoutUseCasesModule,
    ExerciseUseCasesModule,
    LogUseCasesModule,
    SessionUseCasesModule,
    DatabaseModule,
    PhysicalUseCasesModule,
  ],
  controllers: [
    // User
    DeleteUserController,
    MeController,
    SignInController,
    SignUpController,
    UpdateUserPersonalInfoController,
    ChangeMyUserPasswordController,
    ForgotPasswordController,
    NewPasswordController,

    // Image
    UploadImageController,
    DeleteImageController,
    UpdateImageController,

    // Workout
    CreateWorkoutController,
    DeleteWorkoutController,
    FindAllWorkoutsByUserIdController,
    FindWorkoutByIdController,
    FindWorkoutsHistoryByUserIdController,
    FindTotalAndAvgTimeByUserIdController,
    FindTotalWorkoutsCountByUserIdController,
    UpdateWorkoutController,

    // Exercise
    CreateExerciseController,
    DeleteExerciseController,
    FindAllExercisesByWorkoutIdController,
    FindExerciseByIdController,
    UpdateExerciseController,

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
    FindSessionTodayByWorkoutIdAndUserIdController,

    //Physical
    CreatePhysicalController,
    UpdatePhysicalController,
    FindPhysicalStatsByUserIdController,
  ],
  // providers: [
  //   {
  //     provide: APP_GUARD,
  //     useClass: PlanActiveGuard,
  //   },
  // ],
})
export class HttpModule {}
