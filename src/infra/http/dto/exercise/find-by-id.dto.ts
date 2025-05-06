import { ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { SwaggerBadRequestDto, SwaggerResourceNotFoundDto } from '../swagger.dto';
import { ExerciseDto } from './exercise.dto';

export const SwaggerFindExerciseByIdDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiOperation({ operationId: 'findExerciseById' })(target, key, descriptor);
    ApiBearerAuth()(target, key, descriptor);
    ApiResponse({ status: 200, description: 'Exercise found', type: ExerciseDto })(target, key, descriptor);
    ApiNotFoundResponse({
      description: 'Resource not found',
      type: SwaggerResourceNotFoundDto,
    });
    ApiBadRequestResponse({
      description: 'Bad request',
      type: SwaggerBadRequestDto,
    })(target, key, descriptor);
  };
};
