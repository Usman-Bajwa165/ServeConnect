import { IsString, IsIn, IsOptional } from "class-validator";

export class AiSuggestDto {
  @IsString()
  @IsIn(["description", "continuation"])
  type: "description" | "continuation";

  @IsString()
  text: string;

  @IsOptional()
  @IsString()
  title?: string;
}
