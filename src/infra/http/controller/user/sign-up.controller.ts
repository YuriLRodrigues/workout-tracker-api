import { BadRequestException, Body, ConflictException, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RegisterUserUseCase } from '@root/domain/application/use-cases/user/register.use-case';
import { ResourceAlreadyExistsError } from 'src/core/errors/resource-already-exists-error';
import { Public } from 'src/infra/auth/public';

import { SignUpBodyDto, SwaggerSignUpDto } from '../../dto/user/sign-up.dto';

@ApiTags('User')
@Controller('user')
export class SignUpController {
  constructor(private readonly registerUserUseCase: RegisterUserUseCase) {}

  @Public()
  @SwaggerSignUpDto()
  @Post('/sign-up')
  async handle(
    @Body()
    { email, name, password, lastName }: SignUpBodyDto,
  ) {
    const user = await this.registerUserUseCase.execute({
      email,
      name,
      password,
      lastName,
    });

    if (user.isLeft()) {
      const error = user.value;

      switch (error.constructor) {
        case ResourceAlreadyExistsError:
          throw new ConflictException({
            statusCode: HttpStatus.CONFLICT,
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
      message: 'User successfully created',
    };
  }
}
