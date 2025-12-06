"use client";

import CenteredLoader from "@/components/CenteredLoader";
import { Button } from "@/components/ui/button";
import { useChat } from "ai/react";
import { FormEvent, useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";
import { Textarea } from "@/components/ui/textarea";
import { AI_MODEL } from "@/app/api/chat/route";

const CHAT_ENDPOINT = "/api/chat";

export function ChatScreen() {
  const sendButtonRef = useRef<HTMLButtonElement | null>(null);
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading: chatEndpointIsLoading,
  } = useChat({
    api: CHAT_ENDPOINT,
    streamProtocol: "text",
    onError: (e) => {
      console.error("Error:", e);
    },
  });

  useEffect(() => {
    if (sendButtonRef.current) {
      sendButtonRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [messages]);

  async function sendMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!messages.length) {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
    if (chatEndpointIsLoading) {
      return;
    }
    handleSubmit(e);
  }

  return (
    <div>
      <h2 className="text-lg font-bold text-center">
        Chat with my assistant (in development)
      </h2>
      <div className="text-center text-sm text-neutral-500 pb-2">
        Currently utilizing {AI_MODEL} via OpenRouter with Vercel AI
      </div>
      <div>
        {messages.map(({ id, role, content }) => (
          <MessageBubble key={id} role={role} content={content} />
        ))}
      </div>
      {chatEndpointIsLoading && (
        <div className="my-2">
          <CenteredLoader />
        </div>
      )}
      <form onSubmit={sendMessage} className="">
        <Textarea
          value={input}
          placeholder="Type your message"
          onChange={handleInputChange}
          className="my-2 p-2"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        <div className="flex justify-end">
          <Button
            ref={sendButtonRef}
            disabled={chatEndpointIsLoading}
            type="submit"
          >
            <span>Send</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
