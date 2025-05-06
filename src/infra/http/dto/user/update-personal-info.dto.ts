import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiOperation,
  ApiProperty,
  ApiPropertyOptional,
  ApiResponse,
} from '@nestjs/swagger';
import { UserGender } from '@root/domain/enterprise/types/user';
import { IsDateString, IsEnum, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

import { SwaggerBadRequestDto, SwaggerResourceAlreadyExistsDto } from '../swagger.dto';

export class UpdatePersonalInfoBodyDto {
  @ApiPropertyOptional({
    example: 'John',
    description: "The user's first name",
    type: String,
    required: false,
  })
  @IsString({ message: 'This field must be a string' })
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    example: 'Doe',
    description: "The user's last name",
    required: false,
    type: String,
  })
  @IsString({ message: 'This field must be a string' })
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({
    example: '+5511999999999',
    description: 'The user phone number',
    required: false,
    type: String,
  })
  @IsPhoneNumber(null, { message: 'This field must be a valid phone number' })
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    example: '1990-01-01',
    description: 'The user birth date (YYYY-MM-DD)',
    required: false,
    type: Date || String,
  })
  @IsDateString()
  @IsOptional()
  birthDate?: Date | string;

  @ApiPropertyOptional({
    example: 'MALE',
    description: 'The user gender',
    required: false,
    enum: UserGender,
  })
  @IsEnum(UserGender, { message: 'Invalid gender value' })
  @IsOptional()
  gender?: UserGender;
}

class UpdatePersonalInfoResponseDto {
  @ApiProperty({
    description: 'Api response message according to request',
    example: 'Personal information updated',
  })
  message: string;
}

export const SwaggerUpdatePersonalInfoDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiOperation({ operationId: 'updatePersonalInfo' })(target, key, descriptor);
    ApiBearerAuth()(target, key, descriptor);
    ApiResponse({
      status: 201,
      description: 'Personal information updated',
      type: UpdatePersonalInfoResponseDto,
    })(target, key, descriptor);
    ApiBadRequestResponse({
      description: 'Bad request',
      type: SwaggerBadRequestDto,
    })(target, key, descriptor);
    ApiConflictResponse({
      description: 'Resource already exists',
      type: SwaggerResourceAlreadyExistsDto,
    })(target, key, descriptor);
  };
};
