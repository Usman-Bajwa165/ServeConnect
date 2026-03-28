import { IsString, IsIn, IsOptional } from "class-validator";

export class AiSuggestDto {
  @IsString()
  @IsIn(["description", "continuation", "grammar"])
  type: "description" | "continuation" | "grammar";

  @IsString()
  text: string;

  @IsOptional()
  @IsString()
  title?: string;
}
