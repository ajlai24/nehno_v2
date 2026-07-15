"use client";

import { useInView } from "react-intersection-observer";
import { Tables } from "@/utils/supabase/supabase.types";
import { SwitchCollectionContent } from "./SwitchCollectionContent";

interface SwitchGridProps {
  switches: Tables<"switches">[];
  loading: boolean;
  error: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onSelectSwitch: (switchDetails: Tables<"switches">) => void;
}

export function SwitchGrid({
  switches,
  loading,
  error,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  onSelectSwitch,
}: SwitchGridProps) {
  const { ref: loadMoreRef } = useInView({
    triggerOnce: false,
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
  });

  return (
    <div className="col-span-3 lg:col-span-4 lg:border-l h-full">
      <div
        className={`
          lg:p-4
          lg:pr-0
          w-full
          ${loading ? "h-full" : ""}
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
          gap-4
        `}
      >
        <SwitchCollectionContent
          isLoading={loading}
          isError={error}
          switches={switches}
          onSelectSwitch={onSelectSwitch}
        />
      </div>

      <div ref={loadMoreRef} className="h-16" />
    </div>
  );
}
