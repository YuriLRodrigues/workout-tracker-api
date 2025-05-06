import { ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiOperation, ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString } from 'class-validator';

import { ApiPaginatedResponse } from '../pagination.dto';
import { SwaggerBadRequestDto, SwaggerResourceNotFoundDto } from '../swagger.dto';

export class FindAllByUserIdDto {
  @ApiProperty({ type: () => String, description: 'Unique identifier of the session' })
  id: string;

  @ApiProperty({ type: () => Date, description: 'Start time of the session' })
  @IsDate()
  startTime: Date;

  @ApiProperty({ type: () => Date, description: 'End time of the session' })
  @IsDate()
  endTime: Date;

  @ApiProperty({ type: String, description: 'Color associated with the session' })
  @IsString()
  color: string;

  @ApiProperty({ type: String, description: 'Icon representing the session' })
  @IsString()
  icon: string;

  @ApiProperty({ type: String, description: 'Name of the workout' })
  @IsString()
  workoutName: string;

  @ApiProperty({ type: String, description: 'Description of the workout' })
  @IsString()
  workoutDescription: string;

  @ApiProperty({ type: () => String, description: 'Unique identifier of the workout' })
  workoutId: string;
}

export const SwaggerFindAllByUserIdDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiOperation({ operationId: 'findAllSessionByUserId' })(target, key, descriptor);
    ApiBearerAuth()(target, key, descriptor);
    ApiPaginatedResponse(FindAllByUserIdDto)(target, key, descriptor);
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
