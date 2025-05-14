import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
} from '@nestjs/swagger';

import { SwaggerBadRequestDto, SwaggerResourceNotFoundDto } from '../swagger.dto';
import { PhysicalDto } from './physical.dto';

class FindPhysicalStatsByUserIdResponseDto {
  @ApiProperty({
    description: 'Data found or not of the physical stats by user id',
    nullable: true,
  })
  data: PhysicalDto | null;
}

export const SwaggerFindPhysicalStatsByUserIdDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiOperation({ operationId: 'findPhysicalStatsByUserId' })(target, key, descriptor);
    ApiBearerAuth()(target, key, descriptor);
    ApiOkResponse({
      description: 'Physical found or not',
      type: FindPhysicalStatsByUserIdResponseDto,
    })(target, key, descriptor);
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
