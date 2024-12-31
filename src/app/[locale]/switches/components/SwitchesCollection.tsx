"use client";

import { AutoComplete, Option } from "@/components/Autocomplete";
import CenteredLoader from "@/components/CenteredLoader";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Icons } from "@/components/ui/icons";
import { useFiltersStore } from "@/stores/useFilterStore";
import { Tables } from "@/utils/supabase/supabase.types";
import { createClient } from "@supabase/supabase-js";
import { useCallback, useState } from "react";
import { FilterPanel } from "./FilterPanel";
import { SwitchCard } from "./SwitchCard";
import { SwitchDetailsContent } from "./SwitchDialogContent";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function SwitchesCollection({
  initialSwitches,
  filters,
}: {
  initialSwitches: Tables<"switches">[];
  filters: Record<string, string[]>;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [switches, setSwitches] = useState(initialSwitches);
  const [searchSuggestions, setSearchSuggestions] = useState<Option[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedSwitch, setSelectedSwitch] = useState<
    Tables<"switches"> | undefined
  >();
  const { selectedFilters, resetFilters } = useFiltersStore();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fetchSwitches = async (query: any) => {
    try {
      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setSwitches(data || []);
    } catch (error) {
      console.error("Error fetching switches:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllSwitches = async () => {
    setLoading(true);
    const query = supabase.from("switches").select();
    setSelectedSwitch(undefined);
    await fetchSwitches(query);
  };

  const fetchFilteredSwitches = async () => {
    setLoading(true);

    let query = supabase.from("switches").select();

    for (const group in selectedFilters) {
      const filtersArray = Array.from(selectedFilters[group]);
      if (filtersArray.length > 0) {
        query = query.in(group, filtersArray);
      }
    }
    setSelectedSwitch(undefined);
    await fetchSwitches(query);
  };

  // Fetch search suggestions based on search input
  const handleQueryChange = async (searchInput: string) => {
    setLoadingSuggestions(true);
    let query = supabase.from("switches").select();
    query = query
      .or(
        `name.ilike.%${searchInput}%,brand.ilike.%${searchInput}%,series.ilike.%${searchInput}%`
      )
      .limit(5);

    const { data, error } = await query;
    if (error) {
      console.error(error);
    } else {
      // Convert to Option
      const suggestions = data.map((switchDetails) => {
        const { brand, series, name } = switchDetails;
        const label = `${brand} ${series} ${name}`;
        return {
          value: switchDetails.id,
          label,
        };
      });
      setSearchSuggestions(suggestions || []);
      setLoadingSuggestions(false);
    }
  };

  // Fetch switches based on selected option
  const handleSelectOption = async (selectedOption: Option | undefined) => {
    setLoading(true);
    resetFilters();

    if (!selectedOption) {
      const query = supabase.from("switches").select();
      await fetchSwitches(query);
      return;
    }

    const { label } = selectedOption;
    await handleSearch(label);
  };

  // Do search based on search input
  const handleSearch = async (searchInput: string) => {
    setLoading(true);
    resetFilters();
    const { data, error } = await supabase.rpc("search_switches", {
      query: searchInput,
    });

    try {
      if (error) {
        throw error;
      }

      setSwitches(data || []); // Set the fetched switches or empty array
    } catch (error) {
      console.error("Error fetching switches:", error); // Improved error logging
    } finally {
      setLoading(false); // Ensure loading is always set to false after fetching
    }
  };

  const memoizedFetchFilteredSwitches = useCallback(fetchFilteredSwitches, [
    selectedFilters,
  ]);

  return (
    <div className="flex-grow flex flex-col">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl lg:text-4xl font-bold">
          Mechanical Keyboard Switches
        </h2>

        <AutoComplete
          className="hidden lg:block"
          options={searchSuggestions}
          emptyMessage="No results."
          placeholder="Search..."
          isLoading={loadingSuggestions}
          onSelect={handleSelectOption}
          onQueryChange={handleQueryChange}
          onSearch={handleSearch}
        />
      </div>

      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <div className="flex items-center gap-2 justify-between lg:hidden">
          <DrawerTrigger className="lg:hidden" asChild>
            <Button className="my-2" size="sm" variant="outline">
              <Icons.filter className="h-5 w-5" />
              <span>Filter</span>
            </Button>
          </DrawerTrigger>

          <AutoComplete
            className="block lg:hidden"
            options={searchSuggestions}
            emptyMessage="No results."
            placeholder="Search..."
            isLoading={loadingSuggestions}
            onSelect={handleSelectOption}
            onQueryChange={handleQueryChange}
            onSearch={handleSearch}
          />
        </div>

        <DrawerTitle className="hidden">Filters</DrawerTitle>
        <DrawerContent>
          <div className="px-4">
            <FilterPanel
              filters={filters}
              onFilterChange={memoizedFetchFilteredSwitches}
              onResetFilters={fetchAllSwitches}
              closeDrawer={() => setDrawerOpen(false)}
            />
          </div>
        </DrawerContent>
      </Drawer>

      <div className="grid lg:grid-cols-5 grow">
        <FilterPanel
          className="hidden lg:block"
          filters={filters}
          onFilterChange={memoizedFetchFilteredSwitches}
          onResetFilters={fetchAllSwitches}
        />

        <div className="col-span-3 lg:col-span-4 lg:border-l h-full">
          <div
            className={`lg:p-4 lg:pr-0 w-full ${loading ? "h-full" : ""} grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4`}
          >
            {loading ? (
              <div className="col-span-full h-full">
                <CenteredLoader />
              </div>
            ) : switches.length === 0 ? (
              <div className="pt-4">
                0 Results
              </div>
            ) : (
              switches.map((switchDetails) => (
                <div key={switchDetails.id}>
                  <SwitchCard
                    details={switchDetails}
                    onClick={() => {
                      setSelectedSwitch(switchDetails);
                      setOpen(true);
                    }}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={() => setOpen(false)}>
        <SwitchDetailsContent details={selectedSwitch} />
      </Dialog>
    </div>
  );
}
