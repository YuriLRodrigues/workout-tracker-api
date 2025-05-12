import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
} from '@nestjs/swagger';

import { SwaggerBadRequestDto, SwaggerResourceNotFoundDto } from '../swagger.dto';

export class FindTotalSeriesByWeekDto {
  @ApiProperty({
    description: 'Difference in series compared to the previous week',
    example: 12.5,
  })
  seriesDiff: number;

  @ApiProperty({
    description: 'Series counting this week',
    example: 13600,
  })
  thisWeekTotal: number;
}

export const SwaggerFindTotalSeriesByWeekDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiOperation({ operationId: 'findTotalSeriesByWeek' })(target, key, descriptor);
    ApiBearerAuth()(target, key, descriptor);
    ApiOkResponse({ type: FindTotalSeriesByWeekDto, description: 'Avg series found' })(target, key, descriptor);
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
