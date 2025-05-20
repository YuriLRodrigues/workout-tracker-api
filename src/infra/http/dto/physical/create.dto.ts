import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiProperty,
  ApiPropertyOptional,
  ApiResponse,
} from '@nestjs/swagger';
import { IsNumber, IsOptional, IsPositive, IsString, Max, Min } from 'class-validator';

import { SwaggerBadRequestDto, SwaggerResourceNotFoundDto } from '../swagger.dto';

class CreatePhysicalResponseDto {
  @ApiProperty({
    example: 'Physical successfully created',
    description: 'Api response message according to request',
  })
  @IsString()
  message: string;
}

export class CreatePhysicalBodyDto {
  @ApiProperty({
    example: 175,
    description: 'Height in centimeters',
  })
  @IsNumber()
  @IsPositive()
  height: number;

  @ApiProperty({
    example: 70,
    description: 'Weight in kilograms',
  })
  @IsNumber()
  @IsPositive()
  weight: number;

  @ApiProperty({
    example: 25,
    description: 'Age in years',
    minimum: 1,
    maximum: 200,
  })
  @IsNumber()
  @Min(1)
  @Max(200)
  age: number;

  @ApiPropertyOptional({
    example: 18,
    description: 'Body fat percentage (optional)',
    minimum: 1,
    maximum: 100,
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  bodyFat?: number;

  @ApiPropertyOptional({
    example: 35,
    description: 'Muscle mass in kilograms (optional)',
    minimum: 1,
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  muscleMass?: number;

  @ApiProperty({
    example: 'Lose weight',
    description: 'User goal, such as "Lose weight", "Gain muscle", etc.',
  })
  @IsString()
  goal: string;
}

export const SwaggerCreatePhysicalDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiOperation({ operationId: 'createPhysical' })(target, key, descriptor);
    ApiBearerAuth()(target, key, descriptor);
    ApiResponse({ status: 201, description: 'Physical created successfully', type: CreatePhysicalResponseDto })(
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
