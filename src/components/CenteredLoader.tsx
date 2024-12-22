"use client";

import { Icons } from "@/components/ui/icons";

export default function CenteredLoader() {
  return (
    <div className="w-full h-full flex flex-1 items-center justify-center">
      <Icons.spinner className="animate-spin" />
    </div>
  );
}
