import { Module } from '@nestjs/common';
import { EnvModule } from '@root/infra/env/env.module';
import { MailModule } from '@root/infra/mailer/mail.module';
import { CryptographyModule } from 'src/infra/cryptography/cryptography.module';
import { DatabaseModule } from 'src/infra/database/database.module';

import { AuthorizationUserUseCase } from './authorization.use-case';
import { ChangeMyUserPasswordUseCase } from './change-my-password';
import { DeleteUserUseCase } from './delete.use-case';
import { ForgotPasswordUseCase } from './forgot-password.use-case';
import { MeUseCase } from './me.use-case';
import { NewPasswordUseCase } from './new-password.use-case';
import { RegisterUserUseCase } from './register.use-case';
import { UpdateUserPersonalInfoUseCase } from './update-personal-info.use-case';

@Module({
  imports: [DatabaseModule, CryptographyModule, MailModule, EnvModule],
  providers: [
    AuthorizationUserUseCase,
    DeleteUserUseCase,
    MeUseCase,
    RegisterUserUseCase,
    UpdateUserPersonalInfoUseCase,
    ChangeMyUserPasswordUseCase,
    NewPasswordUseCase,
    ForgotPasswordUseCase,
  ],
  exports: [
    AuthorizationUserUseCase,
    DeleteUserUseCase,
    MeUseCase,
    RegisterUserUseCase,
    UpdateUserPersonalInfoUseCase,
    ChangeMyUserPasswordUseCase,
    NewPasswordUseCase,
    ForgotPasswordUseCase,
  ],
})
export class UserUseCasesModule {}
