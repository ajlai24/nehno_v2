"use client";

import { useState, useEffect } from "react";
import { FilterPanel } from "./FilterPanel";
import { createClient } from "@supabase/supabase-js";
import { Tables } from "@/utils/supabase/supabase.types";
import { SwitchCard } from "./SwitchCard";
import { useFiltersStore } from "@/stores/useFilterStore";
import CenteredLoader from "@/components/CenteredLoader";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/Input";
import { TbSearch } from "react-icons/tb";
import debounce from "lodash.debounce";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const debouncedSearch = debounce((query: string) => {
    setDebouncedQuery(query);
  }, 600);

  const { selectedFilters } = useFiltersStore();

  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => debouncedSearch.cancel();
  }, [debouncedSearch, searchQuery]);

  useEffect(() => {
    const fetchFilteredSwitches = async () => {
      setLoading(true);

      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

      let query = supabase.from("switches").select();

      if (debouncedQuery) {
        query = query.or(
          `name.ilike.%${debouncedQuery}%,brand.ilike.%${debouncedQuery}%,series.ilike.%${debouncedQuery}%`
        );
      }

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
  }, [debouncedQuery, selectedFilters]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setDebouncedQuery(searchQuery);
    } else {
      debouncedSearch(searchQuery);
    }
  };

  return (
    <div className="flex-grow flex flex-col">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl lg:text-4xl font-bold">
          Mechanical Keyboard Switches
        </h2>
        <Input
          className="hidden lg:flex"
          icon={TbSearch}
          iconProps={{ behavior: "prepend" }}
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      <Drawer>
        <div className="flex items-center gap-2 justify-between lg:hidden">
          <DrawerTrigger className="lg:hidden" asChild>
            <Button className="my-2" size="sm" variant="outline">
              <Icons.filter className="h-5 w-5" />
              <span>Filter</span>
            </Button>
          </DrawerTrigger>

          <Input
            className="lg:hidden h-8"
            icon={TbSearch}
            iconProps={{ behavior: "prepend" }}
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <DrawerTitle className="hidden">Filters</DrawerTitle>
        <DrawerContent>
          <div className="px-4">
            <FilterPanel filters={filters} />
          </div>
        </DrawerContent>
      </Drawer>

      <div className="grid lg:grid-cols-5 grow">
        <FilterPanel className="hidden lg:block" filters={filters} />

        <div className="col-span-3 lg:col-span-4 lg:border-l h-full">
          <div
            className={`lg:p-4 lg:pr-0 w-full ${loading ? "h-full" : ""} grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4`}
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
