import { ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiOperation, ApiProperty } from '@nestjs/swagger';
import { ExecutionType } from '@root/domain/enterprise/types/exercise';
import { IsEnum } from 'class-validator';

import { ApiPaginatedResponse } from '../pagination.dto';
import { SwaggerBadRequestDto, SwaggerResourceNotFoundDto } from '../swagger.dto';
import { LogDto } from './log.dto';

export class Logs extends LogDto {
  @ApiProperty({
    description: 'Exercise execution type',
    enum: ExecutionType,
    example: ExecutionType.REPETITION,
  })
  @IsEnum(ExecutionType)
  exerciseExecutionType: ExecutionType;
}

export const SwaggerFindAllLogsByExerciseIdDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiOperation({ operationId: 'findAllLogsByExerciseId' })(target, key, descriptor);
    ApiBearerAuth()(target, key, descriptor);
    ApiPaginatedResponse(Logs)(target, key, descriptor);
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
