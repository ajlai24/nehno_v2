"use client";

import CenteredLoader from "@/components/CenteredLoader";
import { SwitchCard } from "./SwitchCard";
import { Tables } from "@/utils/supabase/supabase.types";

type SwitchCollectionContentProps = {
  isLoading: boolean;
  isError: boolean;
  switches: Tables<"switches">[];
  setSelectedSwitch: (switchDetails: Tables<"switches">) => void;
  setOpen: (isOpen: boolean) => void;
};

export function SwitchCollectionContent({
  isLoading,
  isError,
  switches,
  setSelectedSwitch,
  setOpen,
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
        onClick={() => {
          setSelectedSwitch(switchDetails);
          setOpen(true);
        }}
      />
    </div>
  ));
}
