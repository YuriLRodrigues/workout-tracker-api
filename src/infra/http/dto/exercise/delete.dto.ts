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

class DeleteExerciseResponseDto {
  @ApiProperty({
    example: 'Exercise successfully deleted',
    description: 'Api response message according to request',
  })
  @IsString()
  message: string;
}

export const SwaggerDeleteExerciseDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiOperation({ operationId: 'deleteExercise' })(target, key, descriptor);
    ApiBearerAuth()(target, key, descriptor);
    ApiResponse({
      status: 200,
      description: 'Exercise successfully deleted',
      type: DeleteExerciseResponseDto,
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
