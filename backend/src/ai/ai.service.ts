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
    this.model = process.env.OLLAMA_MODEL || "tinyllama:latest";
  }

  private buildPrompt(dto: AiSuggestDto): string {
    if (dto.type === "description") {
      return `### Task: Write a professional 2-sentence bio for a "${dto.title || dto.text}" service. Use NO placeholders, NO brackets. Respond with ONLY the text. Bio:`;
    }
    if (dto.type === "grammar") {
      return `### Task: Fix all grammar, spelling, and punctuation errors in the text below. Refine the text to be professional while keeping the original meaning exactly. RESPOND WITH ONLY THE REFINED TEXT. NO EXPLANATIONS. Text to fix: "${dto.text}". Refined Text:`;
    }
    const ctx = dto.title || "service";
    return `### Topic: "${ctx}"\n### Sentence: "${dto.text}"\n### Next 3 words to complete:`;
  }

  private buildOpenAiMessages(dto: AiSuggestDto): any[] {
    if (dto.type === "description") {
      return [
        {
          role: "system",
          content:
            "You are a professional copywriter. Write a professional 2-sentence bio for the requested service. Use NO placeholders, NO brackets. Respond with ONLY the bio text, nothing else.",
        },
        { role: "user", content: `Create a bio for: ${dto.title || dto.text}` },
      ];
    }
    if (dto.type === "grammar") {
      return [
        {
          role: "system",
          content:
            "You are an expert proofreader. Fix all grammar, spelling, and punctuation errors in the provided text. Refine to be professional while keeping the exact meaning. Reply with ONLY the corrected text. Do NOT add preamble, conversational filler, or headers like 'Here is the refined text:' or 'Refining the Text:'.",
        },
        { role: "user", content: dto.text },
      ];
    }
    return [
      {
        role: "system",
        content:
          "You are an autocomplete engine. Given a topic and sentence, provide EXACTLY the next 3 words to complete the sentence. NO preamble.",
      },
      {
        role: "user",
        content: `Topic: ${dto.title || "service"}\nSentence: ${dto.text}`,
      },
    ];
  }

  async getSuggestion(dto: AiSuggestDto): Promise<{ suggestion: string }> {
    try {
      const openaiKey = process.env.OPENAI_API_KEY;
      let suggestion = "";

      // Fallback to Ollama if the key is a placeholder or missing
      if (openaiKey && !openaiKey.includes("your_openai_api_key")) {
        this.logger.debug(`Calling OpenAI with gpt-4o`);
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
        const prompt = this.buildPrompt(dto);
        this.logger.debug(
          `Calling Ollama at ${this.ollamaUrl}/api/generate with model ${this.model}`,
        );

        const response = await axios.post(
          `${this.ollamaUrl}/api/generate`,
          {
            model: this.model,
            stream: false,
            prompt,
            options: {
              temperature: 0.3,
              num_predict: 50,
            },
          },
          { timeout: 30000 },
        );
        suggestion = (response.data?.response || "").trim();
      }

      // Strip the original input if the AI repeated it (common artifact)
      if (
        dto.text &&
        suggestion.toLowerCase().startsWith(dto.text.toLowerCase().trim())
      ) {
        suggestion = suggestion.slice(dto.text.trim().length).trim();
      }

      // Strip common instructional prefixes if they lead into output
      const prefixesToRemove = [
        "Fixing Errors in the Text Below:",
        "Refining the Text:",
        "Here is the refined text:",
        "Result:",
        "Fixed Text:",
        "Completion:",
        "Instruction:",
        "Response:",
        "Natural Words:",
        "Next 3 Words:",
        "Next words:",
        "Consider:",
        "No Prefix",
        "Role:",
        "Input:",
        "### Task:",
        "Fixed:",
        "Bio:",
        "Topic:",
        "Sentence:",
        "Next 3 words to complete:",
        "Refined Text:",
        "Text to fix:",
        "Refined:",
      ];

      let cleaned = false;
      do {
        cleaned = false;
        for (const prefix of prefixesToRemove) {
          if (suggestion.toLowerCase().startsWith(prefix.toLowerCase())) {
            suggestion = suggestion.slice(prefix.length).trim();
            cleaned = true;
          }
        }
      } while (cleaned); // Loop until no more prefixes found (sometimes AI stacks them)

      // Secondary pass for inline repeats or multiple headers
      suggestion = suggestion.replace(
        /^(Fixing Errors in the Text Below:|Refining the Text:|Next 3 Words:|Natural Words:|Completion:|Result:|Fixed Text:|Response:|### Task:|Fixed:|Bio:|Next words:)\s*/gi,
        "",
      );

      // Deep clean: Remove bracketed placeholders like [Insert Name] or [Brackets]
      suggestion = suggestion.replace(/\[[^\]]*\]/g, "").trim();

      // Final cleanup of quotes, trailing colons or systemic artifacts
      suggestion = suggestion
        .replace(/^[:\s\-###"]+|[:\s\-###"]+$/g, "")
        .trim();

      return { suggestion };
    } catch (error: any) {
      this.logger.warn(`AI suggestion failed: ${error.message}`);
      return { suggestion: "" };
    }
  }
}
