import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
} from '@nestjs/swagger';

import { SwaggerBadRequestDto, SwaggerResourceNotFoundDto } from '../swagger.dto';

export class FindSessionTodayByUserIdResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the session',
    type: String,
    nullable: true,
  })
  id: string | null;
}

export const SwaggerFindSessionTodayByUserIdDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiOperation({ operationId: 'findTodaySessionByUserId' })(target, key, descriptor);
    ApiBearerAuth()(target, key, descriptor);
    ApiOkResponse({ type: FindSessionTodayByUserIdResponseDto, description: 'Today session found' })(
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
