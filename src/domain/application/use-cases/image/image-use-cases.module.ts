import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/infra/database/database.module';
import { StorageModule } from 'src/infra/storage/storage.module';

import { DeleteImageUseCase } from './delete.use-case';
import { UpdateImageUseCase } from './update.use-case';
import { UploadImageUseCase } from './upload.use-case';

@Module({
  imports: [DatabaseModule, StorageModule],
  providers: [DeleteImageUseCase, UpdateImageUseCase, UploadImageUseCase],
  exports: [DeleteImageUseCase, UpdateImageUseCase, UploadImageUseCase],
})
export class ImageUseCasesModule {}
