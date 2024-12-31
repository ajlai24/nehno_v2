"use client";

import { SanityImage } from "@/components/SanityImage";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tables } from "@/utils/supabase/supabase.types";
import { SwitchDetailsTable } from "./SwitchDetailsTable";

interface SwitchCardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  details: Tables<"switches">;
  onClick: () => void;
}

export function SwitchCard({ details, onClick }: SwitchCardProps) {
  const { brand, series, name, feel, profile, image_src } = details;
  const fullName = `${brand} ${series} ${name}`;

  return (
    <Card className="h-full cursor-pointer" onClick={onClick}>
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-center">
          <SanityImage sanitySrc={image_src} alt={fullName} />
        </div>

        <CardTitle className="pt-4">{fullName}</CardTitle>
        <CardDescription>
          <div className="flex justify-between">
            <div className="text-sm">{feel}</div>
            <div className="text-sm">Profile: {profile}</div>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <SwitchDetailsTable details={details} />
      </CardContent>
    </Card>
  );
}
