import { Module } from '@nestjs/common';
import { DatabaseModule } from '@root/infra/database/database.module';

import { CreatePhysicalUseCase } from './create.use-case';
import { FindPhysicalStatsByUserIdUseCase } from './find-physical-stats-by-user-id.use-case';
import { UpdatePhysicalUseCase } from './update.use-case';

@Module({
  imports: [DatabaseModule],
  providers: [CreatePhysicalUseCase, UpdatePhysicalUseCase, FindPhysicalStatsByUserIdUseCase],
  exports: [CreatePhysicalUseCase, UpdatePhysicalUseCase, FindPhysicalStatsByUserIdUseCase],
})
export class PhysicalUseCasesModule {}
