import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { SwaggerBadRequestDto, SwaggerResourceNotFoundDto } from '../swagger.dto';

class CreateSessionResponseDto {
  @ApiProperty({
    example: 'Session successfully created',
    description: 'Api response message according to request',
  })
  @IsString()
  message: string;
}
export const SwaggerCreateSessionDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiOperation({ operationId: 'createSession' })(target, key, descriptor);
    ApiBearerAuth()(target, key, descriptor);
    ApiResponse({ status: 201, description: 'Session created successfully', type: CreateSessionResponseDto })(
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
