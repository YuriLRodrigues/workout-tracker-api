import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
} from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { SwaggerBadRequestDto, SwaggerResourceNotFoundDto } from '../swagger.dto';

class FindLogTodayByExerciseIdResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the log',
    example: 'c71c2c77-5d44-4a9b-9e4b-3f0e6d6d9c55',
    nullable: true,
  })
  @IsString()
  id: string;
}

export const SwaggerFindLogTodayByExerciseIdDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiOperation({ operationId: 'findLogTodayByExerciseId' })(target, key, descriptor);
    ApiBearerAuth()(target, key, descriptor);
    ApiOkResponse({ type: FindLogTodayByExerciseIdResponseDto, description: 'Logs completed found' })(
      target,
      key,
      descriptor,
    );
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
