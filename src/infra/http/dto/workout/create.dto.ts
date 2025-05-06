import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiProperty,
  ApiPropertyOptional,
  ApiResponse,
} from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { SwaggerBadRequestDto, SwaggerResourceNotFoundDto } from '../swagger.dto';

class CreateWorkoutResponseDto {
  @ApiProperty({
    example: 'Workout successfully created',
    description: 'Api response message according to request',
  })
  @IsString()
  message: string;
}

export class CreateWorkoutBodyDto {
  @ApiProperty({
    description: 'The name of the workout',
    example: 'Electronics',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'A brief description of the workout',
    example: 'Devices and gadgets such as phones, tablets, and computers.',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'An icon representing the workout',
    example: 'smartphone',
  })
  @IsNotEmpty()
  @IsString()
  icon: string;

  @ApiProperty({
    description: 'An color representing the workout icon',
    example: 'smartphone',
  })
  @IsNotEmpty()
  @IsString()
  color: string;

  @ApiPropertyOptional({
    description: 'Optional banner ID associated with the workout',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsOptional()
  @IsString()
  bannerId?: string;
}

export const SwaggerCreateWorkoutDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiOperation({ operationId: 'createWorkout' })(target, key, descriptor);
    ApiBearerAuth()(target, key, descriptor);
    ApiResponse({ status: 201, description: 'Workout created successfully', type: CreateWorkoutResponseDto })(
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
