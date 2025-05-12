import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
} from '@nestjs/swagger';

import { SwaggerBadRequestDto, SwaggerResourceNotFoundDto } from '../swagger.dto';

export class FindAverageWorkoutByWeekDto {
  @ApiProperty({
    description: 'Difference in workout compared to the previous week',
    example: 12.5,
  })
  workoutDiffCount: number;

  @ApiProperty({
    description: 'Count of workouts this week',
    example: 13600,
  })
  thisWeekCount: number;
}

export const SwaggerFindAverageWorkoutByWeekDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiOperation({ operationId: 'findAverageWorkoutByWeek' })(target, key, descriptor);
    ApiBearerAuth()(target, key, descriptor);
    ApiOkResponse({ type: FindAverageWorkoutByWeekDto, description: 'Avg workout found' })(target, key, descriptor);
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
