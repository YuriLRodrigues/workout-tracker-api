import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiProperty,
  ApiPropertyOptional,
  ApiResponse,
} from '@nestjs/swagger';
import { ExecutionType, MuscleType } from '@root/domain/enterprise/types/exercise';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

import { SwaggerBadRequestDto, SwaggerResourceNotFoundDto } from '../swagger.dto';

class UpdateExerciseResponseDto {
  @ApiProperty({
    example: 'Exercise successfully updated',
    description: 'Api response message according to request',
  })
  @IsString()
  message: string;
}

export class UpdateExerciseBodyDto {
  @ApiPropertyOptional({
    description: 'The name of the exercise',
    example: 'Push-up',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'A brief description of the exercise',
    example: 'An upper body strength exercise.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Type of execution: repetition or time',
    example: 'REPETITION',
    enum: ExecutionType,
  })
  @IsOptional()
  @IsEnum(ExecutionType)
  executionType?: ExecutionType;

  @ApiPropertyOptional({
    description: 'The muscle group targeted by the exercise',
    example: 'CHEST',
    enum: MuscleType,
  })
  @IsOptional()
  @IsEnum(MuscleType)
  muscleType?: MuscleType;

  @ApiPropertyOptional({
    description: 'Target number of repetitions',
    example: 15,
  })
  @IsOptional()
  @IsNumber()
  targetRepetitions?: number;

  @ApiPropertyOptional({
    description: 'Target rest time between sets (in seconds)',
    example: 60,
  })
  @IsOptional()
  @IsNumber()
  targetResTime?: number;

  @ApiPropertyOptional({
    description: 'Target number of sets',
    example: 4,
  })
  @IsOptional()
  @IsNumber()
  targetSets?: number;

  @ApiPropertyOptional({
    description: 'Optional video reference for the exercise',
    example: 'https://example.com/video.mp4',
  })
  @IsOptional()
  @IsString()
  videoReference?: string;

  @ApiPropertyOptional({
    description: 'Optional banner ID associated with the exercise',
    example: 'a61b0a54-2cbb-4a77-92ee-1e5e6d6db9a7',
  })
  @IsOptional()
  @IsString()
  bannerId?: string;
}

export const SwaggerUpdateExerciseDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiOperation({ operationId: 'updateExercise' })(target, key, descriptor);
    ApiBearerAuth()(target, key, descriptor);
    ApiResponse({ status: 201, description: 'Exercise updated successfully', type: UpdateExerciseResponseDto })(
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
