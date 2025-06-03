import { IsString, IsEmail, IsEnum, IsDateString, IsOptional, IsArray } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsDateString()
  dateOfBirth: string;

  @IsString()
  phone: string;

  @IsString()
  address: string;

  @IsString()
  password: string;

  @IsEnum(['COMMON', 'PROVIDER'])
  userType: 'COMMON' | 'PROVIDER';

  @IsOptional()
  @IsArray()
  serviceIds?: number[];

  @IsOptional()
  @IsString()
  profilePictureUrl?: string;
}
