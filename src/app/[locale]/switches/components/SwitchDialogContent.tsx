"use client";

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Tables } from "@/utils/supabase/supabase.types";
import { SwitchDetailsTable } from "./SwitchDetailsTable";
import { SwitchImage } from "./SwitchImage";

interface SwitchDetailsContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  details?: Tables<"switches">;
}

export function SwitchDetailsContent({
  className,
  details,
}: SwitchDetailsContentProps) {
  if (!details) {
    return (
      <DialogContent className={cn("w-11/12 rounded-lg", className)}>
        <div className="text-center text-gray-500">
          Unable to load details. Please try again later.
        </div>
      </DialogContent>
    );
  }

  const { brand, series, name, image_src } = details;

  const title = `${brand} ${series} ${name}`;

  return (
    <DialogContent className={cn("w-11/12 rounded-lg", className)}>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <SwitchImage src={image_src} alt={title} />
      <SwitchDetailsTable details={details} />
    </DialogContent>
  );
}
