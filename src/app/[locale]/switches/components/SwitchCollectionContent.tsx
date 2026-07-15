"use client";

import CenteredLoader from "@/components/CenteredLoader";
import { Tables } from "@/utils/supabase/supabase.types";
import { SwitchCard } from "./SwitchCard";

interface SwitchCollectionContentProps {
  isLoading: boolean;
  isError: boolean;
  switches: Tables<"switches">[];
  onSelectSwitch: (switchDetails: Tables<"switches">) => void;
}

export function SwitchCollectionContent({
  isLoading,
  isError,
  switches,
  onSelectSwitch,
}: SwitchCollectionContentProps) {
  if (isError) {
    return <div>Failed to load switches</div>;
  }

  if (isLoading) {
    return (
      <div className="col-span-full h-full">
        <CenteredLoader />
      </div>
    );
  }

  if (switches.length === 0) {
    return <div className="pt-4">0 Results</div>;
  }

  return switches.map((switchDetails) => (
    <div key={switchDetails.id}>
      <SwitchCard
        details={switchDetails}
        onClick={() => onSelectSwitch(switchDetails)}
      />
    </div>
  ));
}
