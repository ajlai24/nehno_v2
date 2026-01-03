import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge"; // Edge runtime is required for streaming

export const OPENROUTER_BASE_URL =
  process.env.OPENROUTER_BASE_URL || "https://openrouter.ai";
export const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

export const AI_MODEL = "openai/gpt-oss-20b:free";

type Message = {
  role: string;
  content: string;
};

type Choice = {
  message: Message;
};

const formatMessage = (message: Message) => {
  return {
    role: message.role,
    content: message.content,
  };
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body.messages ?? [];

    const initialPrompt = {
      role: "system",
      content: "You are a personal assistant that's a work in progress.",
    };

    if (messages.length === 0) {
      messages.unshift(initialPrompt);
    }

    const formattedMessages = messages.map(formatMessage);

    const response = await fetch(
      `${OPENROUTER_BASE_URL}/api/v1/chat/completions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: AI_MODEL,
          messages: formattedMessages,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        const remainingRequests = response.headers.get('x-ratelimit-remaining');
        const resetTime = response.headers.get('x-ratelimit-reset');

        console.log("======================= Rate Limit Exceeded ======================");
        console.log(`Remaining Requests: ${remainingRequests}`);
        console.log(`Reset Time: ${resetTime}`);

        let resetDate: string | null = null;
        if (resetTime) {
          resetDate = new Date(parseInt(resetTime, 10)).toISOString();
        }

        const apiResponse = new NextResponse(
          JSON.stringify({
            error: 'Too Many Requests',
            message: 'You have exceeded the rate limit.',
            rateLimit: {
              remaining: 0,
              reset: resetDate,
            },
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        return apiResponse;
      }

      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Process the response data as needed
    const parsedMessages = data.choices.map((choice: Choice) => {
      let content = choice.message.content;

      try {
        // Attempt to parse the content as JSON
        const parsedContent = JSON.parse(content);
        if (Array.isArray(parsedContent) && parsedContent.length > 0) {
          content = parsedContent[0].content || content;
        }
      } catch (error) {
        console.warn("Failed to parse content as JSON:", error);
      }

      return content;
    });

    return new Response(parsedMessages, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
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
