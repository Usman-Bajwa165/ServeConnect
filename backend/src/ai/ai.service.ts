import { Injectable, Logger } from "@nestjs/common";
import axios from "axios";
import { AiSuggestDto } from "./dto/ai-suggest.dto";

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly ollamaUrl: string;
  private readonly model: string;

  constructor() {
    this.ollamaUrl = process.env.OLLAMA_URL || "http://localhost:11434";
    this.model = process.env.OLLAMA_MODEL || "tinyllama:latest";
  }

  private buildPrompt(dto: AiSuggestDto): string {
    if (dto.type === "description") {
      return `Write a professional 2-sentence service description for: ${dto.title || dto.text}.\nReturn only the description text, no quotes, no prefix.`;
    }
    return `Complete this text naturally in 5 words or fewer.\nReturn ONLY the completion words, nothing else.\nText so far: ${dto.text}`;
  }

  async getSuggestion(dto: AiSuggestDto): Promise<{ suggestion: string }> {
    try {
      const prompt = this.buildPrompt(dto);

      const response = await axios.post(
        `${this.ollamaUrl}/api/generate`,
        {
          model: this.model,
          stream: false,
          prompt,
          options: {
            temperature: 0.7,
            num_predict: 30,
          },
        },
        { timeout: 10000 },
      );

      const suggestion = (response.data?.response || "").trim();
      return { suggestion };
    } catch (error) {
      this.logger.warn(`Ollama AI suggestion failed: ${error.message}`);
      return { suggestion: "" };
    }
  }
}
