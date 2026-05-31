import { Injectable, Logger } from "@nestjs/common";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AiSuggestDto } from "./dto/ai-suggest.dto";

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly geminiApiKey: string;
  private readonly model: string;

  constructor() {
    this.geminiApiKey = process.env.GEMINI_API_KEY || "";
    this.model = process.env.GEMINI_MODEL || "gemini-3.5-flash";
  }

  async getSuggestion(dto: AiSuggestDto): Promise<{ suggestion: string }> {
    const systemInstruction =
      "You are a text refinement tool. You receive a piece of text and you return ONLY a corrected version of that exact text — fixing spelling, grammar, and punctuation, and making it professional. You do NOT answer questions, you do NOT give advice, you do NOT add new information, you do NOT explain anything. You only return the refined version of the input text and nothing else.";

    try {
      if (!this.geminiApiKey) {
        this.logger.error(
          "GEMINI_API_KEY is not set in environment variables.",
        );
        return { suggestion: "" };
      }

      this.logger.debug(
        `Calling @google/generative-ai SDK with model ${this.model}`,
      );

      const genAI = new GoogleGenerativeAI(this.geminiApiKey);
      const modelInstance = genAI.getGenerativeModel({
        model: this.model,
        systemInstruction: systemInstruction,
      });

      const contents = [
        {
          role: "user",
          parts: [
            {
              text: "i need plumer for my house pipe is leaking bad water evryware need fast",
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: "I need a plumber for my house. The pipe is leaking badly and water is everywhere. Need someone urgently.",
            },
          ],
        },
        {
          role: "user",
          parts: [
            {
              text: "gud electricin needed for wiring fixng in ofice all socket not working",
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: "A good electrician is needed for wiring repair in the office. All sockets are not working.",
            },
          ],
        },
        {
          role: "user",
          parts: [
            {
              text: `${dto.title ? `Context: ${dto.title}\n` : ""}${dto.text}`,
            },
          ],
        },
      ];

      const result = await modelInstance.generateContent({
        contents,
        generationConfig: {
          temperature: 0.2,
        },
      });

      const suggestion = (result.response.text() || "").trim();
      return { suggestion };
    } catch (error: any) {
      const errorMsg = error.message || error;
      this.logger.warn(`Gemini SDK suggestion failed: ${errorMsg}`);
      return { suggestion: "" };
    }
  }
}
