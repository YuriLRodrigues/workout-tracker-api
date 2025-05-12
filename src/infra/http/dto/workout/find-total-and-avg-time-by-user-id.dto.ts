import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
} from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

import { SwaggerBadRequestDto, SwaggerResourceNotFoundDto } from '../swagger.dto';

export class FindTotalAndAvgTimeByUserIdResponseDto {
  @ApiProperty({
    description: 'Average time in seconds',
    example: 120,
  })
  @IsNumber()
  @IsPositive()
  avgSeconds: number;

  @ApiProperty({
    description: 'Total time in seconds',
    example: 3600,
  })
  @IsNumber()
  @IsPositive()
  totalSeconds: number;
}

export const SwaggerFindTotalAndAvgTimeByUserIdDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiOperation({ operationId: 'findTotalAndAvgTimeByUserId' })(target, key, descriptor);
    ApiBearerAuth()(target, key, descriptor);
    ApiOkResponse({ example: 'Total and Avg time in seconds', type: FindTotalAndAvgTimeByUserIdResponseDto })(
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
