import { Controller, Post, Body, UseGuards } from "@nestjs/common";
import { AiService } from "./ai.service";
import { AiSuggestDto } from "./dto/ai-suggest.dto";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@Controller("ai")
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post("suggest")
  getSuggestion(@Body() dto: AiSuggestDto) {
    return this.aiService.getSuggestion(dto);
  }
}
