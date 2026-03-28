import { IsString, IsInt, Min, Max, IsUUID } from "class-validator";

export class CreateReviewDto {
  @IsUUID()
  targetId: string;

  @IsUUID()
  applicationId: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  comment: string;
}
