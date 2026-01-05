import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { convertToModelMessages, streamText } from "ai";
import { NextRequest } from "next/server";

export const runtime = "edge"; // Edge runtime is required for streaming

export const OPENROUTER_BASE_URL =
  process.env.OPENROUTER_BASE_URL || "https://openrouter.ai";
export const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

export const AI_MODEL = "openai/gpt-oss-20b:free";

interface OpenRouterError {
  status?: number;
  message?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body.messages ?? [];

    const formattedMessages = await convertToModelMessages(messages);

    const openrouter = createOpenRouter({
      apiKey: OPENROUTER_API_KEY,
    });

    const response = streamText({
      model: openrouter(AI_MODEL),
      messages: formattedMessages,
    });

    return response.toUIMessageStreamResponse();
  } catch (err: unknown) {
    if (err instanceof Error) {
      const status = (err as OpenRouterError)?.status; // OpenRouter adds this dynamically

      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
          status: 429,
          headers: { "Content-Type": "application/json" },
        });
      }

      console.error("AI SDK error:", err.message);
      return new Response(JSON.stringify({ error: "AI request failed" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Fallback for non-Error throw
    console.error("Unexpected error:", err);
    return new Response(JSON.stringify({ error: "Unexpected server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
