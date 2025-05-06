import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiProperty,
  ApiPropertyOptional,
  ApiResponse,
} from '@nestjs/swagger';
import { IsDate, IsDateString, IsEmail, IsEnum, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { UserGender, UserRole } from 'src/domain/enterprise/types/user';

import { SwaggerBadRequestDto, SwaggerResourceNotFoundDto } from '../swagger.dto';

export class MeDto {
  @ApiProperty({ description: 'User ID', example: 'uuid-v4' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'User role', example: UserRole.USER })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ description: 'User name', example: 'John' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'User last name', example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description: 'User phone number',
    example: '+5511999999999',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsPhoneNumber(null)
  phone?: string | null;

  @ApiPropertyOptional({
    description: 'User birth date (YYYY-MM-DD)',
    example: '1990-01-01',
    nullable: true,
    required: false,
  })
  @IsOptional()
  @IsDate()
  birthDate?: Date | null;

  @ApiPropertyOptional({
    description: 'User gender',
    example: UserGender.MALE,
    enum: UserGender || null,
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsEnum(UserGender)
  gender?: UserGender | null;

  @ApiPropertyOptional({
    description: 'Avatar image URL',
    example: 'https://example.com/avatar.png',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  avatar?: string | null;

  @ApiPropertyOptional({
    description: 'BlurHash for avatar image',
    example: 'LKO2?U%2Tw=w]~RBVZRi};RPxuwH',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  blurHash?: string;

  @IsDateString()
  @ApiProperty({
    description: 'Date the user was created',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;
}

export const SwaggerMeDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiOperation({ operationId: 'me' })(target, key, descriptor);
    ApiBearerAuth()(target, key, descriptor);
    ApiResponse({ status: 200, description: 'Profile details', type: MeDto })(target, key, descriptor);
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
