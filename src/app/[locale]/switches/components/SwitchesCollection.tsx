"use client";

import { useState, useEffect } from "react";
import { FilterPanel } from "./FilterPanel";
import { createClient } from "@supabase/supabase-js";
import { Tables } from "@/utils/supabase/supabase.types";
import { SwitchCard } from "./SwitchCard";
import { useFiltersStore } from "@/stores/useFilterStore";
import CenteredLoader from "@/components/CenteredLoader";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export default function SwitchesCollection({
  initialSwitches,
  filters,
}: {
  initialSwitches: Tables<"switches">[];
  filters: Record<string, string[]>;
}) {
  const [switches, setSwitches] = useState(initialSwitches);
  const [loading, setLoading] = useState(false);

  const { selectedFilters } = useFiltersStore();

  useEffect(() => {
    const fetchFilteredSwitches = async () => {
      setLoading(true);

      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

      let query = supabase.from("switches").select();

      for (const group in selectedFilters) {
        const filtersArray = Array.from(selectedFilters[group]);
        if (filtersArray.length > 0) {
          query = query.in(group, filtersArray);
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error(error);
      } else {
        setSwitches(data || []);
      }

      setLoading(false);
    };

    fetchFilteredSwitches();
  }, [selectedFilters]);

  return (
    <div className="flex-grow flex flex-col">
      <h2 className="text-4xl font-bold">Mechanical Keyboard Switches</h2>
      <div className="grid lg:grid-cols-5 grow">
        <FilterPanel filters={filters} />
        <div className="col-span-3 lg:col-span-4 lg:border-l h-full">
          <div
            className={`p-4 w-full ${loading ? "h-full" : ""} grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4`}
          >
            {loading ? (
              <div className="col-span-full h-full">
                <CenteredLoader />
              </div>
            ) : (
              switches.map((switchDetails) => (
                <div key={switchDetails.id}>
                  <SwitchCard details={switchDetails} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
