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
import { useEffect, useState } from "react";
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
  const [loading, setLoading] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [value, setValue] = useState<Option>();
  const [switches, setSwitches] = useState(initialSwitches);
  const [searchSuggestions, setSearchSuggestions] = useState<Option[]>([]);
  const { selectedFilters, resetFilters } = useFiltersStore();
  const [open, setOpen] = useState<boolean>(false);
  const [selectedSwitch, setSelectedSwitch] = useState<
    Tables<"switches"> | undefined
  >();

  useEffect(() => {
    const fetchFilteredSwitches = async () => {
      setLoading(true);
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
    if (!selectedOption) {
      setValue(undefined);
      resetFilters();
      setLoading(false);
      return;
    }
    const { value } = selectedOption;
    let query = supabase.from("switches").select();
    query = query.or(`id.eq.${value}`);
    const { data, error } = await query;
    if (error) {
      console.error(error);
    } else {
      setSwitches(data || []);
    }
    setLoading(false);
    setValue(selectedOption);
  };

  // Do search based on search input
  const handleSearch = async (searchInput: string) => {
    setLoading(true);
    resetFilters();
    let query = supabase.from("switches").select();
    query = query.or(
      `name.ilike.%${searchInput}%,brand.ilike.%${searchInput}%,series.ilike.%${searchInput}%`
    );

    const { data, error } = await query;
    if (error) {
      console.error(error);
    } else {
      setSwitches(data || []);
      setLoading(false);
    }
  };

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
          value={value}
          onSelect={handleSelectOption}
          onQueryChange={handleQueryChange}
          onSearch={handleSearch}
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

          <AutoComplete
            className="block lg:hidden"
            options={searchSuggestions}
            emptyMessage="No results."
            placeholder="Search..."
            isLoading={loadingSuggestions}
            value={value}
            onSelect={handleSelectOption}
            onQueryChange={handleQueryChange}
            onSearch={handleSearch}
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
