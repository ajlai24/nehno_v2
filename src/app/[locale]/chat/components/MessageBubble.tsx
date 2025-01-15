"use client";

import { cn } from "@/lib/utils";
import { Message } from "ai/react";
import { VscRobot } from "react-icons/vsc";

export function MessageBubble({
  role,
  content,
}: {
  role: Message["role"];
  content: string;
}) {
  const isUser = role === "user";
  return (
    <div className={cn("flex", { "justify-end": isUser })}>
      <div
        className={cn("message my-3", {
          "dark:bg-neutral-500 bg-neutral-300 px-5 py-2 rounded-xl": isUser,
        })}
      >
        <div className="flex gap-3">
          {!isUser && (
            <div className="pt-0.5 text-lg">
              <VscRobot />
            </div>
          )}
          <p>{content}</p>
        </div>
      </div>
    </div>
  );
}
