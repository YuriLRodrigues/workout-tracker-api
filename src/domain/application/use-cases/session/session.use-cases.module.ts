import { Module } from '@nestjs/common';
import { DatabaseModule } from '@root/infra/database/database.module';

import { CreateSessionUseCase } from './create.use-case';
import { FindAllByUserIdUseCase } from './find-all-by-user-id.use-case';
import { FindAverageTimeByWeekUseCase } from './find-average-time-by-week.use-case';
import { FindAverageWorkoutByWeekUseCase } from './find-average-workout-by-week.use-case';
import { FindFrequencyByWeekAndUserIdUseCase } from './find-frequency-by-week-and-user-id.use-case';
import { FindSessionTodayByWorkoutIdAndUserIdUseCase } from './find-today-by-user-id.use-case';
import { FindSessionTodayByWorkoutIdUseCase } from './find-today-by-workout-id.use-case';
import { FindTotalLoadByWeekUseCase } from './find-total-load-by-week.use-case';
import { FindTotalSeriesByWeekUseCase } from './find-total-series-by-week.use-case';
import { UpdateSessionUseCase } from './update.use-case';

@Module({
  imports: [DatabaseModule],
  providers: [
    CreateSessionUseCase,
    FindSessionTodayByWorkoutIdUseCase,
    UpdateSessionUseCase,
    FindAverageWorkoutByWeekUseCase,
    FindAverageTimeByWeekUseCase,
    FindTotalLoadByWeekUseCase,
    FindTotalSeriesByWeekUseCase,
    FindAllByUserIdUseCase,
    FindFrequencyByWeekAndUserIdUseCase,
    FindSessionTodayByWorkoutIdAndUserIdUseCase,
  ],
  exports: [
    CreateSessionUseCase,
    FindSessionTodayByWorkoutIdUseCase,
    UpdateSessionUseCase,
    FindAverageWorkoutByWeekUseCase,
    FindAverageTimeByWeekUseCase,
    FindTotalLoadByWeekUseCase,
    FindTotalSeriesByWeekUseCase,
    FindAllByUserIdUseCase,
    FindFrequencyByWeekAndUserIdUseCase,
    FindSessionTodayByWorkoutIdAndUserIdUseCase,
  ],
})
export class SessionUseCasesModule {}
