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

class UpdatePhysicalResponseDto {
  @ApiProperty({
    example: 'Physical successfully updated',
    description: 'Api response message according to request',
  })
  @IsString()
  message: string;
}

export class UpdatePhysicalBodyDto {
  @ApiPropertyOptional({
    example: 175,
    description: 'Height in centimeters',
    minimum: 30,
    nullable: true,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  height?: number;

  @ApiPropertyOptional({
    example: 70,
    description: 'Weight in kilograms',
    minimum: 1,
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  weight?: number;

  @ApiPropertyOptional({
    example: 25,
    description: 'Age in years',
    minimum: 1,
    maximum: 120,
    nullable: true,
  })
  @IsNumber()
  @Min(1)
  @Max(200)
  @IsOptional()
  age?: number;

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

  @ApiPropertyOptional({
    example: 'Lose weight',
    description: 'User goal, such as "Lose weight", "Gain muscle", etc.',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  goal?: string;
}

export const SwaggerUpdatePhysicalDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiOperation({ operationId: 'updatePhysical' })(target, key, descriptor);
    ApiBearerAuth()(target, key, descriptor);
    ApiResponse({ status: 200, description: 'Physical updated successfully', type: UpdatePhysicalResponseDto })(
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
