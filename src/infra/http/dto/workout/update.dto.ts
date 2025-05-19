import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiMethodNotAllowedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiProperty,
  ApiPropertyOptional,
  ApiResponse,
} from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { SwaggerBadRequestDto, SwaggerNotAllowedDto, SwaggerResourceNotFoundDto } from '../swagger.dto';

class UpdateWorkoutResponseDto {
  @ApiProperty({
    example: 'Workout successfully updated',
    description: 'Api response message according to request',
  })
  @IsString()
  message: string;
}

export class UpdateWorkoutBodyDto {
  @ApiPropertyOptional({
    description: 'The name of the workout',
    example: 'Electronics',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'A brief description of the workout',
    example: 'Devices and gadgets such as phones, tablets, and computers.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'An icon representing the workout',
    example: 'smartphone',
  })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({
    description: 'An color representing the workout icon',
    example: 'smartphone',
  })
  @IsOptional()
  @IsString()
  color?: string;
}

export const SwaggerUpdateWorkoutDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiOperation({ operationId: 'updateWorkout' })(target, key, descriptor);
    ApiBearerAuth()(target, key, descriptor);
    ApiResponse({ status: 201, description: 'Workout updated successfully', type: UpdateWorkoutResponseDto })(
      target,
      key,
      descriptor,
    );
    ApiNotFoundResponse({
      description: 'Resource not found',
      type: SwaggerResourceNotFoundDto,
    })(target, key, descriptor);
    ApiMethodNotAllowedResponse({
      description: 'Not allowed',
      type: SwaggerNotAllowedDto,
    });
    ApiBadRequestResponse({
      description: 'Bad request',
      type: SwaggerBadRequestDto,
    })(target, key, descriptor);
  };
};
