import { ApiBadRequestResponse, ApiConflictResponse, ApiOperation, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

import { SwaggerBadRequestDto, SwaggerResourceAlreadyExistsDto } from '../swagger.dto';

export class SignUpBodyDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The user email',
    type: String,
  })
  @IsEmail({}, { message: 'The email field is not valid' })
  @IsNotEmpty({ message: 'This field cannot be empty' })
  email: string;

  @ApiProperty({
    example: 'John',
    description: "The user's first name",
    type: String,
  })
  @IsString({ message: 'This field must be a string' })
  @IsNotEmpty({ message: 'This field cannot be empty' })
  name: string;

  @ApiProperty({
    example: 'Doe',
    description: "The user's last name",
    type: String,
  })
  @IsString({ message: 'This field must be a string' })
  @IsNotEmpty({ message: 'This field cannot be empty' })
  lastName: string;

  @ApiProperty({
    example: 'StrongPassword123!',
    description: 'The user password',
    type: String,
  })
  @IsStrongPassword({
    minLength: 6,
    minNumbers: 1,
    minLowercase: 1,
    minUppercase: 1,
    minSymbols: 1,
  })
  @IsNotEmpty({ message: 'This field cannot be empty' })
  password: string;
}

class SignUpResponseDto {
  @ApiProperty({
    description: 'Api response message according to request',
    example: 'User created successfully',
  })
  message: string;
}

export const SwaggerSignUpDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiOperation({ operationId: 'signUp' })(target, key, descriptor);
    ApiResponse({
      status: 201,
      description: 'User created successfully',
      type: SignUpResponseDto,
    })(target, key, descriptor);
    ApiBadRequestResponse({
      description: 'Bad request',
      type: SwaggerBadRequestDto,
    })(target, key, descriptor);
    ApiConflictResponse({
      description: 'Resource already exists',
      type: SwaggerResourceAlreadyExistsDto,
    })(target, key, descriptor);
  };
};
