import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
} from '@nestjs/swagger';

import { SwaggerBadRequestDto, SwaggerResourceNotFoundDto } from '../swagger.dto';

export class FindAverageTimeByWeekDto {
  @ApiProperty({
    description: 'Difference in seconds compared to the previous week',
    example: 12.5,
  })
  timeDiffSeconds: number;

  @ApiProperty({
    description: 'Total seconds accumulated this week',
    example: 13600,
  })
  totalThisWeekSeconds: number;
}

export const SwaggerFindAverageTimeByWeekDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiOperation({ operationId: 'findAverageTimeByWeek' })(target, key, descriptor);
    ApiBearerAuth()(target, key, descriptor);
    ApiOkResponse({ type: FindAverageTimeByWeekDto, description: 'Avg time found' })(target, key, descriptor);
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
