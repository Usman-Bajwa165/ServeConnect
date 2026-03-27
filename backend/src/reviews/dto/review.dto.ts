import { IsString, IsInt, Min, Max, IsUUID } from "class-validator";

export class CreateReviewDto {
  @IsUUID()
  targetId: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  comment: string;
}
