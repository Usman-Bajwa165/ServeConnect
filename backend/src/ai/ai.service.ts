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

  async getSuggestion(dto: AiSuggestDto): Promise<{ suggestion: string }> {
    const messages = [
      {
        role: "system",
        content:
          "You are a text refinement tool. You receive a piece of text and you return ONLY a corrected version of that exact text — fixing spelling, grammar, and punctuation, and making it professional. You do NOT answer questions, you do NOT give advice, you do NOT add new information, you do NOT explain anything. You only return the refined version of the input text and nothing else.",
      },
      {
        role: "user",
        content:
          "i need plumer for my house pipe is leaking bad water evryware need fast",
      },
      {
        role: "assistant",
        content:
          "I need a plumber for my house. The pipe is leaking badly and water is everywhere. Need someone urgently.",
      },
      {
        role: "user",
        content:
          "gud electricin needed for wiring fixng in ofice all socket not working",
      },
      {
        role: "assistant",
        content:
          "A good electrician is needed for wiring repair in the office. All sockets are not working.",
      },
      {
        role: "user",
        content: `${dto.title ? `Context: ${dto.title}\n` : ""}${dto.text}`,
      },
    ];

    try {
      const openaiKey = process.env.OPENAI_API_KEY;

      if (openaiKey && !openaiKey.includes("your_openai_api_key")) {
        const response = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          { model: "gpt-4o", messages, temperature: 0.2 },
          {
            headers: { Authorization: `Bearer ${openaiKey}` },
            timeout: 30000,
          },
        );
        const suggestion = (
          response.data?.choices?.[0]?.message?.content || ""
        ).trim();
        return { suggestion };
      }

      this.logger.debug(`Calling Ollama chat with model ${this.model}`);
      const response = await axios.post(
        `${this.ollamaUrl}/api/chat`,
        {
          model: this.model,
          stream: false,
          messages,
          options: { temperature: 0.1, num_predict: 200 },
        },
        { timeout: 90000 },
      );
      const suggestion = (response.data?.message?.content || "")
        .trim()
        .replace(/^["|']+|["|']+$/g, "")
        .trim();
      return { suggestion };
    } catch (error: any) {
      this.logger.warn(`AI suggestion failed: ${error.message}`);
      return { suggestion: "" };
    }
  }
}
