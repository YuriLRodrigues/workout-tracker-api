import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  NotFoundException,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthorizationUserUseCase } from '@root/domain/application/use-cases/user/authorization.use-case';
import { InactiveResourceError } from 'src/core/errors/inactive-resource-error';
import { InvalidCredentialsError } from 'src/core/errors/invalid-credentials-error';
import { Public } from 'src/infra/auth/public';

import { SignInBodyDto, SwaggerSignInDto } from '../../dto/user/sign-in.dto';

@ApiTags('User')
@Controller('user')
export class SignInController {
  constructor(private readonly authorizationUserUseCase: AuthorizationUserUseCase) {}

  @Public()
  @Post('/sign-in')
  @SwaggerSignInDto()
  async handle(@Body() { email, password }: SignInBodyDto) {
    const user = await this.authorizationUserUseCase.execute({
      email,
      password,
    });

    if (user.isLeft()) {
      const error = user.value;

      switch (error.constructor) {
        case InvalidCredentialsError:
          throw new NotFoundException({
            statusCode: HttpStatus.NOT_FOUND,
            error: error.message,
          });
        case InactiveResourceError:
          throw new UnauthorizedException({
            statusCode: HttpStatus.UNAUTHORIZED,
            error: error.message,
          });
        default:
          throw new BadRequestException({
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Internal API error',
          });
      }
    }

    return {
      token: user.value,
    };
  }
}
