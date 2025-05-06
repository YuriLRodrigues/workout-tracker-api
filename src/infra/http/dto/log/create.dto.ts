import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiProperty,
  ApiPropertyOptional,
  ApiResponse,
} from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

import { SwaggerBadRequestDto, SwaggerResourceNotFoundDto } from '../swagger.dto';

class CreateLogResponseDto {
  @ApiProperty({
    example: 'Log successfully created',
    description: 'Api response message according to request',
  })
  @IsString()
  message: string;
}

export class CreateLogBodyDto {
  @ApiProperty({
    description: 'Average rest time between sets (in seconds)',
    example: 60,
  })
  @IsNotEmpty()
  @IsNumber()
  averageRestTime: number;

  @ApiProperty({
    description: 'Maximum number of repetitions achieved',
    example: 15,
  })
  @IsNotEmpty()
  @IsNumber()
  maxRepeat: number;

  @ApiProperty({
    description: 'Maximum number of sets achieved',
    example: 4,
  })
  @IsNotEmpty()
  @IsNumber()
  maxSeries: number;

  @ApiProperty({
    description: 'Maximum weight lifted (in kilograms)',
    example: 100,
  })
  @IsNotEmpty()
  @IsNumber()
  maxWeight: number;

  @ApiPropertyOptional({
    description: 'Optional notes or observations about the log',
    example: 'Focus on keeping proper form throughout the sets.',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

export const SwaggerCreateLogDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiOperation({ operationId: 'createLog' })(target, key, descriptor);
    ApiBearerAuth()(target, key, descriptor);
    ApiResponse({ status: 201, description: 'Log created successfully', type: CreateLogResponseDto })(
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
