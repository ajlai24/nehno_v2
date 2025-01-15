import { ChatOpenAI } from "@langchain/openai";
// import {
//   START,
//   END,
//   MessagesAnnotation,
//   StateGraph,
//   MemorySaver,
// } from "@langchain/langgraph";
import { PromptTemplate } from "@langchain/core/prompts";
import { Message as VercelChatMessage } from "ai";
import { NextRequest } from "next/server";

export const runtime = "edge"; // Edge runtime is required for streaming

const OPENROUTER_BASE_URL =
  process.env.OPENROUTER_BASE_URL || "https://openrouter.ai";

const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

const TEMPLATE = `You are a personal assistant that's a work in progress.
  
  Current conversation:
  {chat_history}
  
  User: {input}
  AI:`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body.messages ?? [];
    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages[messages.length - 1].content;
    const prompt = PromptTemplate.fromTemplate(TEMPLATE);

    const chatModel = new ChatOpenAI(
      {
        modelName: "anthropic/claude-3.5-sonnet",
        temperature: 0.8,
        maxTokens: 300,
        streaming: true,
        openAIApiKey: process.env.OPENROUTER_API_KEY,
      },
      {
        basePath: `${OPENROUTER_BASE_URL}/api/v1`,
      }
    );

    const chain = prompt.pipe(chatModel);
    const stream = await chain.stream({
      chat_history: formattedPreviousMessages,
      input: currentMessageContent,
    });

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          // Iterate over the chunks from the chatModel.stream
          for await (const chunk of stream) {
            controller.enqueue(
              new TextEncoder().encode(chunk.content.toString())
            );
            console.log(`Sending chunk: ${chunk.content.toString()}`);
          }
          // Close the stream when all chunks have been processed
          controller.close();
        } catch (error) {
          // Handle errors if needed
          controller.error(error);
        }
      },
    });

    // Return the ReadableStream wrapped in a Response
    return new Response(readableStream, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
