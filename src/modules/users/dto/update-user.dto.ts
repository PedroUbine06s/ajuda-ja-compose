// src/users/dto/update-user.dto.ts
import { IsOptional, IsString, IsEmail, IsDateString, IsEnum, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: Date;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsEnum(['COMMON', 'PROVIDER'])
  userType?: 'COMMON' | 'PROVIDER';
}
