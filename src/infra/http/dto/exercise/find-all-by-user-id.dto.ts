import { ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiOperation } from '@nestjs/swagger';

import { ApiPaginatedResponse } from '../pagination.dto';
import { SwaggerBadRequestDto, SwaggerResourceNotFoundDto } from '../swagger.dto';
import { ExerciseDto } from './exercise.dto';

export const SwaggerFindAllExercisesByWorkoutIdDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiOperation({ operationId: 'findAllExercisesByWorkoutId' })(target, key, descriptor);
    ApiBearerAuth()(target, key, descriptor);
    ApiPaginatedResponse(ExerciseDto)(target, key, descriptor);
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
