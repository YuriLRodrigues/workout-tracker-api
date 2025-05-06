import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class SessionDto {
  @ApiProperty({
    description: 'Unique identifier of the session',
    example: 'd87ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Start time of the workout log',
    example: '2025-04-17T12:00:00Z',
  })
  @IsDateString()
  startTime: Date;

  @ApiPropertyOptional({
    description: 'End time of the workout log',
    example: '2025-04-17T13:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  endTime?: Date;

  @ApiProperty({
    description: 'Unique identifier of the workout',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsString()
  workoutId: string;

  @ApiProperty({
    description: 'Unique identifier of the user',
    example: 'd87ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsString()
  userId: string;
}
