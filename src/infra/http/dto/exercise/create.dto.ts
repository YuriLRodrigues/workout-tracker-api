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
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

import { SwaggerBadRequestDto, SwaggerResourceNotFoundDto } from '../swagger.dto';

class CreateExerciseResponseDto {
  @ApiProperty({
    example: 'Exercise successfully created',
    description: 'Api response message according to request',
  })
  @IsString()
  message: string;
}

export class CreateExerciseBodyDto {
  @ApiProperty({
    description: 'The name of the exercise',
    example: 'Push-up',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'A brief description of the exercise',
    example: 'An upper body strength exercise.',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Type of execution: repetition or time',
    example: 'REPETITION',
    enum: ExecutionType,
  })
  @IsNotEmpty()
  @IsEnum(ExecutionType)
  executionType: ExecutionType;

  @ApiProperty({
    description: 'The muscle group targeted by the exercise',
    example: 'CHEST',
    enum: MuscleType,
  })
  @IsNotEmpty()
  @IsEnum(MuscleType)
  muscleType: MuscleType;

  @ApiProperty({
    description: 'Target number of repetitions',
    example: 15,
  })
  @IsNotEmpty()
  @IsNumber()
  targetRepetitions: number;

  @ApiProperty({
    description: 'Target rest time between sets (in seconds)',
    example: 60,
  })
  @IsNotEmpty()
  @IsNumber()
  targetResTime: number;

  @ApiProperty({
    description: 'Target number of sets',
    example: 4,
  })
  @IsNotEmpty()
  @IsNumber()
  targetSets: number;

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

export const SwaggerCreateExerciseDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiOperation({ operationId: 'createExercise' })(target, key, descriptor);
    ApiBearerAuth()(target, key, descriptor);
    ApiResponse({ status: 201, description: 'Exercise created successfully', type: CreateExerciseResponseDto })(
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
