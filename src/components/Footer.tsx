"use client";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { useSelectedLayoutSegment } from "next/navigation";
import Link from "next/link";

const year = new Date().getFullYear();

export function Footer() {
  const selectedLayoutSegment = useSelectedLayoutSegment();
  const pathname = selectedLayoutSegment ? `/${selectedLayoutSegment}` : "/";
  
  // Hide footer on chat page
  if (pathname === "/chat") {
    return null;
  }

  return (
    <footer className="border-t border-border/40 py-6 dark:border-border md:px-8 md:py-0">
      <div className="text-xs text-neutral-500 dark:text-neutral-400 flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        &copy; {year} nehno.com
        <div className="text-center">
          Made with Next.js, Tailwind, shadcn/ui, next-intl, Sanity.io, and
          Supabase
        </div>
        <div className="flex gap-2 align-middle">
          <Button variant="ghost" size="icon">
            <Link href="https://github.com/ajlai24" target="_blank">
              <Icons.gitHub className="h-6 w-6" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon">
            <Link
              href="https://www.linkedin.com/in/devajlai/"
              target="_blank"
            >
              <Icons.linkedin className="h-6 w-6" />
            </Link>
          </Button>
        </div>
      </div>
    </footer>
  );
}

