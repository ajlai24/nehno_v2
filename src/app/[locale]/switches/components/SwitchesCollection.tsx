"use client";

import { Dialog } from "@/components/ui/dialog";
import { Tables } from "@/utils/supabase/supabase.types";
import { useState } from "react";
import { useSwitchQuery } from "../hooks/useSwitchQuery";
import { useSwitchSearch } from "../hooks/useSwitchSearch";
import { SwitchFilters } from "../types/filters";
import { FilterPanel } from "./Filters/FilterPanel";
import { MobileFilters } from "./Filters/MobileFilters";
import { SwitchDetailsContent } from "./SwitchDialogContent";
import { SwitchGrid } from "./SwitchGrid";
import { SwitchToolbar } from "./SwitchToolbar";

export default function SwitchCollection({
  filters,
}: {
  filters: SwitchFilters;
}) {
  const [open, setOpen] = useState(false);
  const [selectedSwitch, setSelectedSwitch] = useState<Tables<"switches">>();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useSwitchQuery();

  const { resetSearch } = useSwitchSearch();

  const switches = data?.pages.flatMap((p) => p.switches) ?? [];

  const handleSelectSwitch = (switchDetails: Tables<"switches">) => {
    setSelectedSwitch(switchDetails);
    setOpen(true);
  };

  return (
    <div className="flex flex-col flex-grow">
      <div className="flex justify-between">
        <h2 className="text-4xl font-bold">Mechanical Keyboard Switches</h2>
        <SwitchToolbar />
      </div>

      <div className="lg:hidden my-2">
        <MobileFilters filters={filters} onReset={resetSearch} />
      </div>

      <div className="grid lg:grid-cols-5">
        <div className="space-y-4 py-4 pr-2">
          <FilterPanel
            className="hidden lg:block"
            filters={filters}
            onResetFilters={resetSearch}
          />
        </div>

        <SwitchGrid
          switches={switches}
          loading={isLoading}
          error={isError}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onSelectSwitch={handleSelectSwitch}
        />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <SwitchDetailsContent details={selectedSwitch} />
      </Dialog>
    </div>
  );
}
