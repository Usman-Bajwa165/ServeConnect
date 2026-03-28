import { Injectable, Logger } from "@nestjs/common";
import axios from "axios";
import { AiSuggestDto } from "./dto/ai-suggest.dto";

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly ollamaUrl: string;
  private readonly model: string;

  constructor() {
    this.ollamaUrl = (
      process.env.OLLAMA_URL || "http://127.0.0.1:11434"
    ).replace(/\/$/, "");
    if (this.ollamaUrl.includes("localhost")) {
      this.ollamaUrl = this.ollamaUrl.replace("localhost", "127.0.0.1");
    }
    this.model = process.env.OLLAMA_MODEL || "llama3.2:1b";
  }

  private buildOllamaMessages(dto: AiSuggestDto): any[] {
    if (dto.type === "description") {
      return [
        {
          role: "system",
          content:
            "You are a professional copywriter. Write a concise 2-sentence service description. Output ONLY the description text. No labels, no explanations, no quotes.",
        },
        { role: "user", content: `Service: ${dto.title || dto.text}` },
      ];
    }
    if (dto.type === "grammar") {
      return [
        {
          role: "system",
          content:
            "You are a spell checker and grammar fixer. The user will send you a text. You must return that exact text with only spelling mistakes, grammar errors, and punctuation fixed. Do NOT rephrase, do NOT add anything, do NOT remove anything, do NOT explain. Return ONLY the corrected refined version of original provided text.",
        },
        { role: "user", content: dto.text },
      ];
    }
    // continuation
    return [
      {
        role: "system",
        content:
          "You are an autocomplete engine. Output ONLY the next 3-5 words that naturally continue the sentence. No labels, no explanations.",
      },
      {
        role: "user",
        content: `Topic: ${dto.title || "service"}\nSentence so far: ${dto.text}`,
      },
    ];
  }

  private buildOpenAiMessages(dto: AiSuggestDto): any[] {
    return this.buildOllamaMessages(dto);
  }

  async getSuggestion(dto: AiSuggestDto): Promise<{ suggestion: string }> {
    try {
      const openaiKey = process.env.OPENAI_API_KEY;
      let suggestion = "";

      if (openaiKey && !openaiKey.includes("your_openai_api_key")) {
        const response = await axios.post(
          `https://api.openai.com/v1/chat/completions`,
          {
            model: "gpt-4o",
            messages: this.buildOpenAiMessages(dto),
            temperature: 0.3,
          },
          {
            headers: { Authorization: `Bearer ${openaiKey}` },
            timeout: 30000,
          },
        );
        suggestion = (
          response.data?.choices?.[0]?.message?.content || ""
        ).trim();
      } else {
        this.logger.debug(`Calling Ollama chat with model ${this.model}`);
        const response = await axios.post(
          `${this.ollamaUrl}/api/chat`,
          {
            model: this.model,
            stream: false,
            messages: this.buildOllamaMessages(dto),
            options: { temperature: 0.1, num_predict: 500 },
          },
          { timeout: 60000 },
        );
        suggestion = (response.data?.message?.content || "").trim();
      }

      // Remove surrounding quotes if the model wrapped the output
      suggestion = suggestion.replace(/^["|']+|["|']+$/g, "").trim();

      return { suggestion };
    } catch (error: any) {
      this.logger.warn(`AI suggestion failed: ${error.message}`);
      return { suggestion: "" };
    }
  }
}
