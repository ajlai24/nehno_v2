"use client";

import CenteredLoader from "@/components/CenteredLoader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChat } from "ai/react";
import { FormEvent } from "react";
import { MessageBubble } from "./MessageBubble";

const CHAT_ENDPOINT = "/api/chat";

export function ChatScreen() {
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
      <h2 className="text-lg text-center">
        Chat with my assistant (in development)
      </h2>
      <div className="text-center text-xs text-neutral-500 pb-2">
        Currently utilizing dolphin3.0-r1-mistral-24b via OpenRouter with Vercel
        AI
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
      <form onSubmit={sendMessage} className="flex gap-2">
        <Input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message"
          className="mb-2 p-2"
        />
        <Button disabled={chatEndpointIsLoading} type="submit">
          <span>Send</span>
        </Button>
      </form>
    </div>
  );
}
