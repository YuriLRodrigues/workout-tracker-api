import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
} from '@nestjs/swagger';

import { SwaggerBadRequestDto, SwaggerResourceNotFoundDto } from '../swagger.dto';

export class FindTotalLoadByWeekDto {
  @ApiProperty({
    description: 'Difference in load compared to the previous week',
    example: 12.5,
  })
  loadDiff: number;

  @ApiProperty({
    description: 'Load counting this week',
    example: 13600,
  })
  thisWeekTotal: number;
}

export const SwaggerFindTotalLoadByWeekDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiOperation({ operationId: 'findTotalLoadByWeek' })(target, key, descriptor);
    ApiBearerAuth()(target, key, descriptor);
    ApiOkResponse({ type: FindTotalLoadByWeekDto, description: 'Avg workout found' })(target, key, descriptor);
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
