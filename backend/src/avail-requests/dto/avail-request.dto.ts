import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsIn,
} from "class-validator";
import { Type } from "class-transformer";
import { PAKISTAN_CITIES } from "../../common/constants/cities.constant";

export class CreateAvailRequestDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Type(() => Number)
  price: number;

  @IsString()
  @IsIn(PAKISTAN_CITIES)
  location: string;
}

export class UpdateAvailRequestDto {
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Type(() => Number)
  price?: number;

  @IsString()
  @IsIn(PAKISTAN_CITIES)
  location?: string;
}
