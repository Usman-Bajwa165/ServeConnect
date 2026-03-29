import { IsString, IsOptional } from "class-validator";

export class AiSuggestDto {
  @IsString()
  text: string;

  @IsOptional()
  @IsString()
  title?: string;
}
