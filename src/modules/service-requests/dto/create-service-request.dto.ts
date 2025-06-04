import { IsNotEmpty, IsNumber, IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateServiceRequestDto {
  @IsNumber()
  @IsNotEmpty()
  serviceProviderId: number;

  @IsNumber()
  @IsNotEmpty()
  serviceId: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsDateString()
  scheduledDate?: Date;
}