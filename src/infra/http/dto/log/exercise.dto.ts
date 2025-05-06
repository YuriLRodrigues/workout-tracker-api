import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ExecutionType, MuscleType } from '@root/domain/enterprise/types/exercise';
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class ExerciseLogsDto {
  @ApiProperty({
    description: 'Unique identifier of the log',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'Highest number of repetitions achieved',
    type: Number,
  })
  maxRepeat: number;

  @ApiProperty({
    description: 'Highest number of sets achieved',
    type: Number,
  })
  maxSeries: number;

  @ApiProperty({
    description: 'Average rest time between sets (in seconds)',
    type: Number,
  })
  averageRestTime: number;

  @ApiProperty({
    description: 'Additional notes or observations about the exercise log',
    type: String,
  })
  notes: string;

  @ApiProperty({
    description: 'Timestamp when the log was created',
    type: Date,
  })
  createdAt: Date;
}

export class ExerciseDto {
  @ApiProperty({
    description: 'Unique identifier for the exercise',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'The name of the exercise',
    example: 'Push-up',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'A brief description of the exercise',
    example: 'An exercise targeting the chest and triceps.',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'The muscle group targeted by the exercise',
    example: 'CHEST',
    enum: MuscleType,
  })
  @IsEnum(MuscleType)
  muscleType: MuscleType;

  @ApiProperty({
    description: 'Type of execution for the exercise (REPETITION or TIME)',
    example: 'REPETITION',
    enum: ExecutionType,
  })
  @IsEnum(ExecutionType)
  executionType: ExecutionType;

  @ApiProperty({
    description: 'Target number of sets',
    example: 4,
  })
  @IsNumber()
  targetSets: number;

  @ApiProperty({
    description: 'Target rest time between sets (in seconds)',
    example: 60,
  })
  @IsNumber()
  targetResTime: number;

  @ApiProperty({
    description: 'Target number of repetitions',
    example: 12,
  })
  @IsNumber()
  targetRepetitions: number;

  @ApiProperty({
    description: 'Max weight of exercise',
    example: 12,
  })
  @IsNumber()
  maxWeight: number;

  @ApiProperty({
    description: 'Last weight of exercise',
    example: 12,
  })
  @IsNumber()
  lastWeight: number;

  @ApiPropertyOptional({
    description: 'Optional video reference URL for the exercise',
    example: 'https://example.com/video.mp4',
  })
  @IsOptional()
  @IsString()
  videoReference?: string;

  @ApiProperty({
    description: 'ID of the user who created the exercise',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'ID of the workout this exercise belongs to',
    example: 'a2f5b52d-32c4-4bdf-91f8-2c7e90d7b0a8',
  })
  @IsString()
  workoutId: string;

  @ApiProperty({
    description: 'List of logs related to the exercise',
    type: [ExerciseLogsDto],
  })
  logs: ExerciseLogsDto[];

  @ApiProperty({
    description: 'Date when the exercise was created',
    example: '2024-04-14T12:00:00Z',
  })
  @IsDateString()
  createdAt: Date;

  @ApiPropertyOptional({
    description: 'Date when the exercise was last updated',
    example: '2025-01-01T15:30:00Z',
  })
  @IsOptional()
  @IsDateString()
  updatedAt?: Date;
}
