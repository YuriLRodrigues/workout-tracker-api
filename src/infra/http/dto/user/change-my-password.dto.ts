import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';
import { IsNotEmpty, IsStrongPassword } from 'class-validator';

import { SwaggerBadRequestDto, SwaggerResourceNotFoundDto } from '../swagger.dto';

class ChangeMyUserPasswordResponseDto {
  @ApiProperty({
    description: 'Api response message according to request',
    example: 'Password successfully modified',
  })
  message: string;
}

export class ChangeMyUserPasswordBodyDto {
  @ApiProperty({
    example: 'StrongPassword123!',
    description: 'The old user password',
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
  oldPassword: string;

  @ApiProperty({
    example: 'StrongPassword123!',
    description: 'The new user password',
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
  newPassword: string;
}

export const SwaggerChangeMyUserPasswordDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiOperation({ operationId: 'changeMyUserPassword' })(target, key, descriptor);
    ApiBearerAuth()(target, key, descriptor);
    ApiResponse({ status: 200, description: 'Password successfully modified', type: ChangeMyUserPasswordResponseDto })(
      target,
      key,
      descriptor,
    );
    ApiNotFoundResponse({
      description: 'Resource not found',
      type: SwaggerResourceNotFoundDto,
    })(target, key, descriptor);
    ApiBadRequestResponse({
      description: 'Bad request',
      type: SwaggerBadRequestDto,
    })(target, key, descriptor);
  };
};
