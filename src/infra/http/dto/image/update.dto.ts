import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';
import { ImageType } from '@root/domain/enterprise/types/image';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsString, ValidateNested } from 'class-validator';

import {
  SwaggerBadRequestDto,
  SwaggerImageSizeErrorDto,
  SwaggerImageTypeErrorDto,
  SwaggerNotAllowedDto,
  SwaggerResourceNotFoundDto,
} from '../swagger.dto';

class UpdateImageResponseDto {
  @ApiProperty({
    example: 'Image successfully uploaded and updated',
    description: 'Api response message according to request',
  })
  @IsString()
  message: string;
}

class NewImageDto {
  @ApiProperty({
    description: 'The name of the file',
    example: 'image1.jpg',
  })
  @IsString()
  fileName: string;

  @ApiProperty({
    description: 'The type of the file (MIME type)',
    example: 'image/jpeg',
  })
  @IsString()
  fileType: string;

  @ApiProperty({
    description: 'The size of the file in bytes',
    example: 102400,
  })
  @IsNumber()
  fileSize: number;

  @ApiProperty({
    description: 'The buffer content of the file',
    example: '817 72 6215 16 122',
  })
  @IsString()
  body: Buffer;
}

export class UpdateImageDto {
  @ApiProperty({
    description: 'New image to be uploaded',
    type: NewImageDto,
  })
  @ValidateNested({ each: true })
  @Type(() => NewImageDto)
  newImage: NewImageDto;

  @ApiProperty({
    description: 'Type of the image',
    example: 'AVATAR',
  })
  @IsEnum(ImageType)
  type: ImageType;
}

export const SwaggerUpdateImageDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiOperation({ operationId: 'updateImage' })(target, key, descriptor);
    ApiBearerAuth()(target, key, descriptor);
    ApiResponse({
      status: 201,
      description: 'Image successfully uploaded and updated',
      type: UpdateImageResponseDto,
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
    ApiNotFoundResponse({ description: 'Resource not found', type: SwaggerResourceNotFoundDto })(
      target,
      key,
      descriptor,
    );
    ApiBadRequestResponse({ description: 'Bad request', type: SwaggerBadRequestDto })(target, key, descriptor);
  };
};
