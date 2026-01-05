"use client";

import { AI_MODEL } from "@/app/api/chat/route";
import CenteredLoader from "@/components/CenteredLoader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";
// import { differenceInHours } from 'date-fns';
import { useEffect, useRef, useState } from "react";
import { MessageBubble } from "./MessageBubble";

export function ChatScreen() {
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const textAreaRef = useRef<HTMLDivElement | null>(null);
  const sendButtonRef = useRef<HTMLButtonElement | null>(null);
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error } = useChat({
    onError: (error) => {
      console.error(error);
    },
  });

  useEffect(() => {
    const textArea = textAreaRef.current;
    if (textArea) {
      textArea.style.height = "auto";
      textArea.style.height = `${textArea.scrollHeight}px`;

      const containerArea = chatContainerRef.current;
      if (containerArea) {
        containerArea.style.paddingBottom = `${textArea.scrollHeight}px`;
      }
    }
  }, [input]);

  const isLoading = status === "streaming" || status === "submitted";

  async function submitMessage(
    e?: React.FormEvent<HTMLFormElement> | React.KeyboardEvent
  ) {
    e?.preventDefault();
    if (!messages.length) {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
    if (!input.trim() || isLoading) {
      return;
    }
    try {
      sendMessage({
        role: "user",
        parts: [{ type: "text", text: input }],
      });
      setInput("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  }

  const hasMessages = messages.length > 0;

  // let rateLimitMessage
  // if (error?.message) {
  //   const parsedError = JSON.parse(error.message);
  //   const { rateLimit } = parsedError;
  //   if (rateLimit) {
  //     const rateLimitReset = new Date(rateLimit.reset);
  //     const now = new Date();

  //     const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  //     rateLimitMessage = `Too many chat requests have been attempted. Please try again ${formatter.format(differenceInHours(rateLimitReset, now), 'hour')}`;
  //   }
  // }

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
  };

  return (
    <div
      ref={chatContainerRef}
      className={cn("chat flex flex-grow overflow-auto", {
        "items-center justify-center": !hasMessages,
      })}
    >
      <div className="w-full">
        {!hasMessages && (
          <div>
            <h2 className="text-lg font-bold text-center">
              Chat with my assistant (in development)
            </h2>
            <div className="text-center text-sm text-neutral-500 pb-2">
              Currently utilizing {AI_MODEL} via OpenRouter with Vercel AI
            </div>
          </div>
        )}

        {messages.map(({ id, role, parts }) => (
          <MessageBubble key={id} role={role} parts={parts} />
        ))}

        {error && (
          <div className="flex justify-center p-4">
            <div className="bg-red-100 text-red-800 border-l-4 border-red-500 p-4 rounded-md">
              Sorry something went wrong. Please try again later!
            </div>
          </div>
        )}

        {isLoading && (
          <div className="my-2">
            <CenteredLoader />
          </div>
        )}

        <div
          ref={textAreaRef}
          className={cn(
            "container min-[1800px]:max-w-[1536px] w-full text-white p-3 md:p-4",
            {
              "bottom-0 left-1/2 transform -translate-x-1/2 fixed": hasMessages,
            }
          )}
        >
          <form
            onSubmit={submitMessage}
            className="dark:bg-neutral-900 bg-neutral-100 rounded-md p-4"
          >
            <Textarea
              value={input}
              placeholder="Type your message"
              onChange={handleInputChange}
              className="my-2 p-2 text-black dark:text-white resize-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 focus-visible:ring-0 border-0 focus:border-0 shadow-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submitMessage(e);
                }
              }}
            />
            <div className="flex justify-end">
              <Button ref={sendButtonRef} disabled={isLoading} type="submit">
                <span>Send</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
