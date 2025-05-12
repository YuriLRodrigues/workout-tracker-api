import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

import { ApiPaginatedResponse } from '../pagination.dto';
import { SwaggerBadRequestDto, SwaggerResourceNotFoundDto } from '../swagger.dto';

export class FindWorkoutsHistoryByUserIdResponseDto {
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

  @ApiProperty({ type: Number, description: 'Total load (sum of maxWeight across all logs)' })
  @IsNumber()
  totalLoad: number;

  @ApiProperty({ type: Number, description: 'Total number of exercises performed in the session' })
  @IsNumber()
  totalExercises: number;
}

export class FindWorkoutsHistoryByUserIdQueryDto {
  @ApiPropertyOptional({ type: String || null, nullable: true, description: 'The workoutId reference to search' })
  @IsOptional()
  @IsString()
  query?: string;
}

export const SwaggerFindWorkoutsHistoryByUserIdDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiOperation({ operationId: 'findWorkoutsHistoryByUserId' })(target, key, descriptor);
    ApiBearerAuth()(target, key, descriptor);
    ApiPaginatedResponse(FindWorkoutsHistoryByUserIdResponseDto)(target, key, descriptor);
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
