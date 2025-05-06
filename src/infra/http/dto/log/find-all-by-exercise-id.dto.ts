import { ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiOperation } from '@nestjs/swagger';

import { ApiPaginatedResponse } from '../pagination.dto';
import { SwaggerBadRequestDto, SwaggerResourceNotFoundDto } from '../swagger.dto';
import { LogDto } from './log.dto';

export const SwaggerFindAllLogsByExerciseIdDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiOperation({ operationId: 'findAllLogsByExerciseId' })(target, key, descriptor);
    ApiBearerAuth()(target, key, descriptor);
    ApiPaginatedResponse(LogDto)(target, key, descriptor);
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
