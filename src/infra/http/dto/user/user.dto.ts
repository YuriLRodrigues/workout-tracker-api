import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  ValidateIf,
} from 'class-validator';
import { UserRole } from 'src/domain/enterprise/types/user';

export class UserDto {
  @ApiProperty({
    example: 'John Doe',
    description: "The user's full name",
    type: String,
  })
  @IsString({ message: 'This field must be a string' })
  @IsNotEmpty({ message: 'The name field is required' })
  name: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'The user email',
    type: String,
  })
  @IsEmail({}, { message: 'The email field is not valid' })
  @IsNotEmpty({ message: 'The email field is required' })
  email: string;

  @ApiProperty({
    example: 'StrongPassword123!',
    description: 'The user password',
    type: String,
  })
  @IsStrongPassword({
    minLength: 6,
    minNumbers: 1,
    minLowercase: 1,
    minUppercase: 1,
    minSymbols: 1,
  })
  @IsNotEmpty({ message: 'The password field is required' })
  password: string;

  @ApiProperty({
    example: UserRole.USER,
    description: "The user's role",
    enum: UserRole,
  })
  @IsEnum(UserRole, {
    message: 'The role must be a valid UserRole',
  })
  @IsNotEmpty({ message: 'The role field is required' })
  role: UserRole;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'The date when the user was disabled',
    type: Date,
    required: false,
  })
  @IsOptional()
  @IsDateString()
  disabled?: Date;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'The date when the user was created',
    type: Date,
  })
  @ValidateIf((obj) => typeof obj.createdAt === 'string' || obj.createdAt instanceof Date)
  @IsDateString()
  @IsNotEmpty()
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'The date when the user was last updated',
    type: Date,
    required: false,
  })
  @ValidateIf((obj) => obj.updatedAt !== undefined)
  @IsDateString()
  @IsOptional()
  updatedAt?: Date;
}
