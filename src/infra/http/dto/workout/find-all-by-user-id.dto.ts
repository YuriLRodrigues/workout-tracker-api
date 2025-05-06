import { ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiOperation } from '@nestjs/swagger';

import { ApiPaginatedResponse } from '../pagination.dto';
import { SwaggerBadRequestDto, SwaggerResourceNotFoundDto } from '../swagger.dto';
import { WorkoutDto } from './workout.dto';

export const SwaggerFindAllWorkoutsByUserIdDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiOperation({ operationId: 'findAllWorkoutsByUserId' })(target, key, descriptor);
    ApiBearerAuth()(target, key, descriptor);
    ApiPaginatedResponse(WorkoutDto)(target, key, descriptor);
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
