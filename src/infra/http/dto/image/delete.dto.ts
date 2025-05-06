import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { SwaggerBadRequestDto, SwaggerNotAllowedDto, SwaggerResourceNotFoundDto } from '../swagger.dto';

class DeleteImageResponseDto {
  @ApiProperty({
    example: 'Image successfully deleted',
    description: 'Api response message according to request',
  })
  @IsString()
  message: string;
}

export const SwaggerDeleteImageDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiOperation({ operationId: 'deleteImage' })(target, key, descriptor);
    ApiBearerAuth()(target, key, descriptor);
    ApiResponse({
      status: 200,
      description: 'Image successfully deleted',
      type: DeleteImageResponseDto,
    })(target, key, descriptor);
    ApiForbiddenResponse({ description: 'Not allowed', type: SwaggerNotAllowedDto })(target, key, descriptor);
    ApiNotFoundResponse({ description: 'Resource not found', type: SwaggerResourceNotFoundDto })(
      target,
      key,
      descriptor,
    );
    ApiBadRequestResponse({ description: 'Bad request', type: SwaggerBadRequestDto })(target, key, descriptor);
  };
};
