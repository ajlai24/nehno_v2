"use client";

import * as React from "react";

export function SectionTitle({
  children,
  position = "left",
}: {
  children: React.ReactNode;
  position?: "left" | "right";
}) {
  return (
    <div>
      <h3
        className={`flex text-2xl lg:text-4xl ${
          position === "left" ? "justify-start" : "lg:justify-end"
        }`}
      >
        {children}
      </h3>
      <div className="relative pt-3">
        <span
          className={`absolute ${
            position === "left" ? "left" : "lg:right-0 right-0"
          }-0 bottom-0 block w-[4rem] lg:w-[6rem] h-[4px] bg-slate-500`}
        />
      </div>
    </div>
  );
}
