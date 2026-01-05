"use client";

import { cn } from "@/lib/utils";
import { UIMessage } from "ai";
import { VscRobot } from "react-icons/vsc";

export function MessageBubble({
  role,
  parts,
}: {
  role: UIMessage["role"];
  parts: UIMessage["parts"];
}) {
  const isUser = role === "user";
  const textContent = parts?.filter(p => p.type === 'text').map(p => p.text).join('');

  if (!textContent && (!parts || parts.length === 0)) return null;

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
          <p className="whitespace-pre-wrap">
            {textContent}
          </p>
        </div>
      </div>
    </div >
  );
}
