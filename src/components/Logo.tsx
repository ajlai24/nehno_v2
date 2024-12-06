"use client";

import * as React from "react";
import Link from "next/link";

export function Logo() {
  return (
    <div className="relative inline-block">
      <Link
        href="/"
        className="flex items-center text-2xl font-extrabold text-primary w-full no-underline group"
      >
        <button className="before:ease relative h-10 w-10 overflow-hidden border border-green-500 bg-green-500 text-white shadow-2xl transition-all before:absolute before:right-0 before:top-0 before:h-10 before:w-6 before:translate-x-12 before:rotate-6 before:bg-white before:opacity-10 before:duration-700 hover:shadow-green-500 hover:before:-translate-x-10">
          <span className="relative z-10">N</span>
        </button>
      </Link>
    </div>
  );
}
