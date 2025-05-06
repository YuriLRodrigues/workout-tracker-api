import { Module } from '@nestjs/common';
import { CryptographyModule } from 'src/infra/cryptography/cryptography.module';
import { DatabaseModule } from 'src/infra/database/database.module';

import { AuthorizationUserUseCase } from './authorization.use-case';
import { DeleteUserUseCase } from './delete.use-case';
import { MeUseCase } from './me.use-case';
import { RegisterUserUseCase } from './register.use-case';
import { UpdateUserPersonalInfoUseCase } from './update-personal-info.use-case';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  providers: [
    AuthorizationUserUseCase,
    DeleteUserUseCase,
    MeUseCase,
    RegisterUserUseCase,
    UpdateUserPersonalInfoUseCase,
  ],
  exports: [AuthorizationUserUseCase, DeleteUserUseCase, MeUseCase, RegisterUserUseCase, UpdateUserPersonalInfoUseCase],
})
export class UserUseCasesModule {}
