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
import { useSwitches } from "@/hooks/use-switches";
import { Tables } from "@/utils/supabase/supabase.types";
import { useEffect, useState } from "react";
import { FilterPanel } from "./FilterPanel";
import { SwitchCard } from "./SwitchCard";
import { SwitchDetailsContent } from "./SwitchDialogContent";
import { useFiltersStore } from "@/stores/useFilterStore";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchSwitches } from "../queries";

export default function SwitchesCollection({
  filters,
}: {
  filters: Record<string, string[]>;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedSwitch, setSelectedSwitch] = useState<
    Tables<"switches"> | undefined
  >();
  const [queryType, setQueryType] = useState<"filtered" | "search" | "all">(
    "all"
  );
  const { searchQuery, setSearchQuery, resetFilters, selectedFilters } =
    useFiltersStore();

  const { searchSuggestions, loadingSuggestions, handleQueryChange } =
    useSwitches();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["switches", queryType, selectedFilters, searchQuery],
    queryFn: ({ pageParam = 0 }) => {
      return fetchSwitches({
        pageParam,
        queryType,
        selectedFilters,
        searchQuery,
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      const { totalPages } = lastPage;
      const nextPageIndex = lastPageParam + 1;
      return nextPageIndex >= totalPages ? undefined : nextPageIndex;
    },
    getPreviousPageParam: (lastPage, allPages, lastPageParam) => {
      return lastPageParam === 0 ? undefined : lastPageParam - 1;
    },
  });

  useEffect(() => {
    if (selectedFilters && Object.keys(selectedFilters).length > 0) {
      setQueryType("filtered");
    } else if (searchQuery) {
      setQueryType("search");
    } else {
      setQueryType("all");
    }
  }, [selectedFilters, searchQuery]);

  if (isLoading) return <CenteredLoader />;
  if (isError) return <div>Error loading switches</div>;

  const switches = data?.pages.flatMap((page) => page.switches) || [];

  const handleSelect = (selectedOption: Option | undefined) => {
    resetFilters();
    if (!selectedOption) {
      setQueryType("all");
    } else {
      const { label } = selectedOption;
      setSearchQuery(label);
      setQueryType("search");
    }
  };

  const handleSearch = (searchInput: string) => {
    resetFilters();
    setSearchQuery(searchInput);
    setQueryType("search");
  };

  const handleFilterChange = () => {
    setQueryType("filtered");
  };

  const handleResetFilters = () => {
    resetFilters();
    setQueryType("all");
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
          onQueryChange={handleQueryChange}
          onSelect={handleSelect}
          onSearch={handleSearch}
        />
      </div>

      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <div className="my-2 flex items-center gap-2 justify-between lg:hidden">
          <DrawerTrigger className="lg:hidden" asChild>
            <Button className="h-8" size="sm" variant="outline">
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
            onQueryChange={handleQueryChange}
            onSelect={handleSelect}
            onSearch={handleSearch}
          />
        </div>

        <DrawerTitle className="hidden">Filters</DrawerTitle>
        <DrawerContent>
          <div className="px-4">
            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              closeDrawer={() => setDrawerOpen(false)}
            />
          </div>
        </DrawerContent>
      </Drawer>

      <div className="grid lg:grid-cols-5 grow">
        <FilterPanel
          className="hidden lg:block"
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
        />

        <div className="col-span-3 lg:col-span-4 lg:border-l h-full">
          <div
            className={`lg:p-4 lg:pr-0 w-full ${isLoading ? "h-full" : ""} grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4`}
          >
            {isLoading ? (
              <div className="col-span-full h-full">
                <CenteredLoader />
              </div>
            ) : switches.length === 0 ? (
              <div className="pt-4">0 Results</div>
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

            <Button
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
            >
              Next page
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={() => setOpen(false)}>
        <SwitchDetailsContent details={selectedSwitch} />
      </Dialog>
    </div>
  );
}
