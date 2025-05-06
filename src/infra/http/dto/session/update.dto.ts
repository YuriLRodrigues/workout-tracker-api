import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { SwaggerBadRequestDto, SwaggerNotAllowedDto, SwaggerResourceNotFoundDto } from '../swagger.dto';

class UpdateSessionResponseDto {
  @ApiProperty({
    example: 'Log successfully deleted',
    description: 'Api response message according to request',
  })
  @IsString()
  message: string;
}

export class UpdateSessionBodyDto {
  @ApiProperty({
    example: 'c71c2c77-5d44-4a9b-9e4b-3f0e6d6d9c55',
    description: 'WorkoutId to be found session and update',
  })
  @IsString()
  workoutId: string;
}

export const SwaggerUpdateSessionDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiOperation({ operationId: 'updateSession' })(target, key, descriptor);
    ApiBearerAuth()(target, key, descriptor);
    ApiResponse({
      status: 200,
      description: 'Log successfully updated',
      type: UpdateSessionResponseDto,
    })(target, key, descriptor);
    ApiForbiddenResponse({ description: 'Not allowed', type: SwaggerNotAllowedDto })(target, key, descriptor);
    ApiNotFoundResponse({ description: 'Resource not found', type: SwaggerResourceNotFoundDto })(
      target,
      key,
      descriptor,
    );
    ApiBadRequestResponse({ description: 'Bad request', type: SwaggerBadRequestDto })(target, key, descriptor);
  };
};
