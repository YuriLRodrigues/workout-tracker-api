import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiOperation,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';
import { IsDateString, IsString } from 'class-validator';

import {
  SwaggerBadRequestDto,
  SwaggerImageSizeErrorDto,
  SwaggerImageTypeErrorDto,
  SwaggerNotAllowedDto,
} from '../swagger.dto';

class Upload {
  @ApiProperty({ description: 'Unique identifier of the image', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'URL of the uploaded image', example: 'https://example.com/uploads/image.png' })
  @IsString()
  url: string;

  @ApiProperty({ description: 'Creation date of the image', example: '2024-12-18T12:00:00Z' })
  @IsDateString()
  createdAt: Date;

  @ApiProperty({ description: 'Last update date of the image', example: '2024-12-18T12:30:00Z' })
  @IsDateString()
  updatedAt: Date;
}

export const SwaggerUploadImageDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiOperation({ operationId: 'uploadImage' })(target, key, descriptor);
    ApiBearerAuth()(target, key, descriptor);
    ApiOperation({ summary: 'Uploads a single file' });
    ApiConsumes('multipart/form-data');
    ApiBody({
      required: true,
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
          },
          type: {
            type: 'string',
            format: 'string',
          },
        },
      },
    });
    ApiResponse({
      status: 201,
      description: 'Image successfully uploaded',
      type: Upload,
    })(target, key, descriptor);
    ApiBadRequestResponse({
      description: `Unsupported file type: 'FILETYPE'`,
      type: SwaggerImageTypeErrorDto,
    })(target, key, descriptor);
    ApiBadRequestResponse({
      description: `File size exceeds the maximum limit of 5MB: 'FILESIZE' bytes`,
      type: SwaggerImageSizeErrorDto,
    })(target, key, descriptor);
    ApiForbiddenResponse({ description: 'Not allowed', type: SwaggerNotAllowedDto })(target, key, descriptor);
    ApiBadRequestResponse({ description: 'Bad request', type: SwaggerBadRequestDto })(target, key, descriptor);
  };
};
