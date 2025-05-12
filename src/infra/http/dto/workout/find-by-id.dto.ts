import { ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { SwaggerBadRequestDto, SwaggerResourceNotFoundDto } from '../swagger.dto';
import { WorkoutDto } from './workout.dto';

export const SwaggerFindWorkoutByIdDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiOperation({ operationId: 'findWorkoutById' })(target, key, descriptor);
    ApiBearerAuth()(target, key, descriptor);
    ApiResponse({ status: 200, description: 'Workout found', type: WorkoutDto })(target, key, descriptor);
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
