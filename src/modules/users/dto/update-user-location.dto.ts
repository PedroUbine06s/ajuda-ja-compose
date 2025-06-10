import {IsNumber, IsNotEmpty, IsLatitude, IsLongitude} from 'class-validator';

export class UpdateUserLocationDto {
  @IsNumber()
  @IsNotEmpty()
  @IsLatitude()
  latitude: number;

  @IsNumber()
  @IsNotEmpty()
  @IsLongitude()
  longitude: number;
}
