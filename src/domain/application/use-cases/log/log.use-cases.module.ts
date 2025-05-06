import { Module } from '@nestjs/common';
import { DatabaseModule } from '@root/infra/database/database.module';

import { CreateLogUseCase } from './create.use-case';
import { DeleteLogUseCase } from './delete.use-case';
import { FindAllLogsByExerciseIdUseCase } from './find-all-by-exercise-id.use-case';
import { FindAllLogsTodayUseCase } from './find-all-logs-today';
import { FindLogTodayByExerciseIdUseCase } from './find-today-by-exercise-id.use-case';

@Module({
  imports: [DatabaseModule],
  providers: [
    CreateLogUseCase,
    DeleteLogUseCase,
    FindAllLogsByExerciseIdUseCase,
    FindAllLogsTodayUseCase,
    FindLogTodayByExerciseIdUseCase,
  ],
  exports: [
    CreateLogUseCase,
    DeleteLogUseCase,
    FindAllLogsByExerciseIdUseCase,
    FindAllLogsTodayUseCase,
    FindLogTodayByExerciseIdUseCase,
  ],
})
export class LogUseCasesModule {}
