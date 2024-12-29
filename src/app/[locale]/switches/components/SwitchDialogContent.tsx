"use client";

import { SanityImage } from "@/components/SanityImage";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Tables } from "@/utils/supabase/supabase.types";
import { SwitchDetailsTable } from "./SwitchDetailsTable";

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
    return <div>Unable to load details. Please try again later</div>;
  }

  const { brand, series, name, image_src } = details;

  const title = `${brand} ${series} ${name}`;

  return (
    <DialogContent className={cn("w-11/12", className)}>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <SanityImage sanitySrc={image_src} alt={title} />
      <SwitchDetailsTable details={details} />
    </DialogContent>
  );
}
