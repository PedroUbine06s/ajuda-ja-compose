import {IsNotEmpty, IsNumber} from 'class-validator';

export class CreateServiceRequestDto {
  @IsNumber()
  @IsNotEmpty()
  serviceProviderId: number;
}
