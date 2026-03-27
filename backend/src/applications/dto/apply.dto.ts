import { IsString, IsNotEmpty, Matches } from "class-validator";

export class ApplyDto {
  @IsString()
  @IsNotEmpty()
  note: string;

  @IsString()
  @Matches(/^\+92 \d{3} \d{7}$/, {
    message: "Contact number must be in format: +92 3XX XXXXXXX",
  })
  contactNumber: string;
}
