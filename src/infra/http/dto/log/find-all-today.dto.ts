import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
} from '@nestjs/swagger';

import { SwaggerBadRequestDto, SwaggerResourceNotFoundDto } from '../swagger.dto';

class FindAllLogsTodayResponseDto {
  @ApiProperty({
    description: 'Total of logs completed today',
  })
  totalCompleted: number;

  @ApiProperty({
    description: 'Total of exercises in workout',
    example: 10,
  })
  totalExercises: number;
}

export const SwaggerFindAllLogsTodayDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiOperation({ operationId: 'findAllLogsToday' })(target, key, descriptor);
    ApiBearerAuth()(target, key, descriptor);
    ApiOkResponse({ type: FindAllLogsTodayResponseDto, description: 'Logs found' })(target, key, descriptor);
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
