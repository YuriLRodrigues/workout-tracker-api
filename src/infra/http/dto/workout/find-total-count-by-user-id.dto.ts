import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
} from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsPositive } from 'class-validator';

import { SwaggerBadRequestDto, SwaggerResourceNotFoundDto } from '../swagger.dto';

export class FindTotalWorkoutsCountByUserIdResponseDto {
  @ApiProperty({
    description: 'Total count of workouts',
    example: 120,
  })
  @IsNumber()
  @IsPositive()
  totalCount: number;

  @ApiProperty({
    description: 'Date of the first training session',
    nullable: true,
    example: '2025-01-01T15:30:00Z',
  })
  @IsOptional()
  @IsDateString()
  since?: Date;
}

export const SwaggerFindTotalWorkoutsCountByUserIdDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiOperation({ operationId: 'findTotalWorkoutsCountByUserId' })(target, key, descriptor);
    ApiBearerAuth()(target, key, descriptor);
    ApiOkResponse({ example: 'Total count of workouts', type: FindTotalWorkoutsCountByUserIdResponseDto })(
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
