import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class WorkoutDto {
  @ApiProperty({
    description: 'Unique identifier for the workout',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Unique identifier for the user who created the workout',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'The name of the workout',
    example: 'Full Body Routine',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'A brief description of the workout',
    example: 'A comprehensive routine targeting all major muscle groups.',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'An icon representing the workout',
    example: 'dumbbell',
  })
  @IsString()
  icon: string;

  @ApiProperty({
    description: 'A color representing the workout icon',
    example: 'blue',
  })
  @IsString()
  color: string;

  @ApiProperty({
    description: 'URL of the workout banner image',
    example: 'https://example.com/banner.jpg',
  })
  @IsOptional()
  @IsString()
  bannerUrl?: string;

  @ApiProperty({
    description: 'Blur hash representation of the banner image for preview purposes',
    example: 'LEHV6nWB2yk8pyo0adR*.7kCMdnj',
  })
  @IsOptional()
  @IsString()
  bannerBlurHash?: string;

  @ApiProperty({
    description: 'Date when the workout was created',
    example: '2024-04-14T12:00:00Z',
    type: String,
  })
  @IsDateString()
  createdAt: Date;

  @ApiPropertyOptional({
    description: 'Date when the workout was last updated',
    example: '2025-01-01T15:30:00Z',
    type: String,
  })
  @IsOptional()
  @IsDateString()
  updatedAt?: Date;

  @ApiProperty({
    description: 'Total number of exercises in the workout',
    example: 8,
  })
  @IsNumber()
  totalExercises: number;

  @ApiProperty({
    description: 'Total number of sets in the workout',
    example: 24,
  })
  @IsNumber()
  totalSets: number;

  @ApiProperty({
    description: 'Total number of repetitions in the workout',
    example: 192,
  })
  @IsNumber()
  totalRepetitions: number;
}
