import { Module } from '@nestjs/common';
import { DatabaseModule } from '@root/infra/database/database.module';

import { CreateWorkoutUseCase } from './create.use-case';
import { DeleteWorkoutUseCase } from './delete.use-case';
import { FindAllWorkoutsByUserIdUseCase } from './find-all-by-user-id.use-case';
import { FindWorkoutByIdUseCase } from './find-by-id.use-case';
import { FindTotalAndAvgTimeByUserIdUseCase } from './find-total-and-avg-time-by-user-id.use-case';
import { FindTotalCountByUserIdUseCase } from './find-total-count-by-user-id.use-case';
import { FindWorkoutsHistoryByUserIdUseCase } from './find-workouts-history-by-user-id.use-case';
import { UpdateWorkoutUseCase } from './update.use-case';

@Module({
  imports: [DatabaseModule],
  providers: [
    CreateWorkoutUseCase,
    DeleteWorkoutUseCase,
    FindAllWorkoutsByUserIdUseCase,
    FindWorkoutByIdUseCase,
    FindTotalAndAvgTimeByUserIdUseCase,
    FindTotalCountByUserIdUseCase,
    FindWorkoutsHistoryByUserIdUseCase,
    UpdateWorkoutUseCase,
  ],
  exports: [
    CreateWorkoutUseCase,
    DeleteWorkoutUseCase,
    FindAllWorkoutsByUserIdUseCase,
    FindWorkoutByIdUseCase,
    FindTotalAndAvgTimeByUserIdUseCase,
    FindTotalCountByUserIdUseCase,
    FindWorkoutsHistoryByUserIdUseCase,
    UpdateWorkoutUseCase,
  ],
})
export class WorkoutUseCasesModule {}
