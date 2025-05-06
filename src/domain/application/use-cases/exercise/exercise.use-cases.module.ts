import { Module } from '@nestjs/common';
import { DatabaseModule } from '@root/infra/database/database.module';

import { CreateExerciseUseCase } from './create.use-case';
import { DeleteExerciseUseCase } from './delete.use-case';
import { FindAllExercisesByWorkoutIdUseCase } from './find-all-by-workout-id.use-case';
import { FindExerciseByIdUseCase } from './find-by-id.use-case';

@Module({
  imports: [DatabaseModule],
  providers: [
    CreateExerciseUseCase,
    DeleteExerciseUseCase,
    FindAllExercisesByWorkoutIdUseCase,
    FindExerciseByIdUseCase,
  ],
  exports: [CreateExerciseUseCase, DeleteExerciseUseCase, FindAllExercisesByWorkoutIdUseCase, FindExerciseByIdUseCase],
})
export class ExerciseUseCasesModule {}
