import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
} from '@nestjs/swagger';

import { SwaggerBadRequestDto, SwaggerResourceNotFoundDto } from '../swagger.dto';
import { SessionDto } from './sesison.dto';

export class FindTodayWorkoutSessionResponseDto {
  @ApiProperty({
    description: 'Data found or not of the today session',
    example: '2025-01-03',
    nullable: true,
  })
  data: SessionDto | null;
}

export const SwaggerFindTodayWorkoutSessionDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiOperation({ operationId: 'findTodayWorkoutSession' })(target, key, descriptor);
    ApiBearerAuth()(target, key, descriptor);
    ApiOkResponse({ type: FindTodayWorkoutSessionResponseDto, description: 'Session found or not' })(
      target,
      key,
      descriptor,
    );
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
