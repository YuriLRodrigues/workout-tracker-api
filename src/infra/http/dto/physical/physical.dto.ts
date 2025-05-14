import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID, Min, Max } from 'class-validator';

export class PhysicalDto {
  @ApiProperty({
    example: 175,
    description: 'User height in centimeters',
  })
  @IsNumber()
  @IsPositive()
  height: number;

  @ApiProperty({
    example: 70,
    description: 'User weight in kilograms',
  })
  @IsNumber()
  @IsPositive()
  weight: number;

  @ApiProperty({
    example: 25,
    description: 'User age in years',
  })
  @IsNumber()
  @Min(1)
  @Max(120)
  age: number;

  @ApiPropertyOptional({
    example: 18.5,
    description: 'User body fat percentage',
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  bodyFat?: number;

  @ApiPropertyOptional({
    example: 35.2,
    description: 'User muscle mass in kilograms',
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  muscleMass?: number;

  @ApiProperty({
    example: 'Lose fat',
    description: 'User fitness goal',
  })
  @IsString()
  @IsNotEmpty()
  goal: string;

  @ApiProperty({
    example: 'f0f8f87d-43c4-4f24-bb0d-ec90f8a6e6b2',
    description: 'User unique identifier',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    example: new Date().toISOString(),
    description: 'Record creation timestamp',
  })
  @IsDate()
  createdAt: Date;

  @ApiPropertyOptional({
    example: new Date().toISOString(),
    description: 'Record last update timestamp',
    nullable: true,
  })
  @IsOptional()
  @IsDate()
  updatedAt?: Date;
}
