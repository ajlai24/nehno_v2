"use client";

import * as React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface ExperienceCardProps {
  dateRange: string;
  title: string;
  body: string;
  badges: string[];
  url: string;
}

export function ExperienceCard({
  dateRange,
  title,
  body,
  badges,
  url,
}: ExperienceCardProps) {
  return (
    <div className="mb-6">
      <Link href={url} target="_blank">
        <div className="p-4 group relative grid transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 rounded-lg hover:bg-neutral-100/80 dark:hover:bg-neutral-800/80">
          <div className="col-span-2 mb-2 mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            {dateRange}
          </div>
          <div className="sm:col-span-6">
            <h3 className="text-slate-600 dark:text-slate-200 leading-snug font-bold">
              {title}
            </h3>
            <div className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              {body}
            </div>
            <div className="flex gap-1 flex-wrap mt-4">
              {badges.map((label) => (
                <Badge
                  key={label}
                  className="hover:bg-neutral-900 dark:hover:bg-neutral-50"
                >
                  {label}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
