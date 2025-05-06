import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class LogDto {
  @ApiProperty({
    description: 'Unique identifier for the log',
    example: 'c71c2c77-5d44-4a9b-9e4b-3f0e6d6d9c55',
  })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Maximum number of sets performed during the exercise',
    example: 4,
  })
  @IsNotEmpty()
  @IsNumber()
  maxSeries: number;

  @ApiProperty({
    description: 'Maximum weight lifted during the exercise (in kilograms)',
    example: 100,
  })
  @IsNotEmpty()
  @IsNumber()
  maxWeight: number;

  @ApiProperty({
    description: 'Maximum number of repetitions achieved in a single set',
    example: 15,
  })
  @IsNotEmpty()
  @IsNumber()
  maxRepeat: number;

  @ApiProperty({
    description: 'Average rest time between sets (in seconds)',
    example: 60,
  })
  @IsNotEmpty()
  @IsNumber()
  averageRestTime: number;

  @ApiPropertyOptional({
    description: 'Optional notes or observations about the exercise session',
    example: 'Struggled on the last set, reduce weight next time.',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    description: 'ID of the related workout session (optional)',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsOptional()
  sessionId?: string;

  @ApiProperty({
    description: 'ID of the exercise being logged',
    example: 'e61b0a54-2cbb-4a77-92ee-1e5e6d6db9a7',
  })
  @IsNotEmpty()
  exerciseId: string;

  @ApiProperty({
    description: 'ID of the user who performed the exercise',
    example: 'a71c2c77-5d44-4a9b-9e4b-3f0e6d6d9c55',
  })
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Date and time when the log was created',
    example: '2025-04-17T18:30:00Z',
  })
  @IsNotEmpty()
  createdAt: Date;
}
