"use client";

import { AutoComplete, Option } from "@/components/Autocomplete";
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
import { useFiltersStore } from "@/stores/useFilterStore";
import { Tables } from "@/utils/supabase/supabase.types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { fetchSwitches } from "../queries";
import { FilterPanel } from "./FilterPanel";
import { SwitchCollectionContent } from "./SwitchCollectionContent";
import { SwitchDetailsContent } from "./SwitchDialogContent";
import { SwitchSort } from "./SwitchSort";

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
  const {
    searchQuery,
    setSearchQuery,
    resetFilters,
    selectedFilters,
    forceMin,
    forceMax,
    selectedSortValue,
  } = useFiltersStore();

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
    queryKey: [
      "switches",
      queryType,
      selectedFilters,
      searchQuery,
      forceMin,
      forceMax,
      selectedSortValue,
    ],
    queryFn: ({ pageParam = 0 }) => {
      return fetchSwitches({
        pageParam,
        queryType,
        selectedFilters,
        searchQuery,
        forceMin,
        forceMax,
        selectedSortValue,
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

  const { ref: loadMoreRef } = useInView({
    triggerOnce: false,
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
  });

  useEffect(() => {
    if (searchQuery) {
      setQueryType("search");
    } else if (
      Object.keys(selectedFilters).length > 0 ||
      forceMin ||
      forceMax
    ) {
      setQueryType("filtered");
    } else {
      setQueryType("all");
    }
  }, [selectedFilters, forceMin, forceMax, searchQuery]);

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
    if (searchInput === "") {
      setQueryType("all");
      return;
    }
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

  const switches = data?.pages.flatMap((page) => page.switches) || [];

  return (
    <div className="flex-grow flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl lg:text-4xl font-bold">
            Mechanical Keyboard Switches
          </h2>
          <div className="text-neutral-500 text-sm">(Work in progress)</div>
        </div>

        <div className="flex gap-2 items-center">
          <div className="pl-4 hidden lg:flex justify-end">
            <div className="">
              <SwitchSort />
            </div>
          </div>
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
      </div>

      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <div className="my-2 flex items-center gap-2 lg:hidden">
          <DrawerTrigger className="lg:hidden" asChild>
            <Button variant="outline">
              <Icons.filter className="h-5 w-5" />
              <span>Filter</span>
            </Button>
          </DrawerTrigger>

          <SwitchSort />
        </div>
        <AutoComplete
          className="block lg:hidden mb-2"
          options={searchSuggestions}
          emptyMessage="No results."
          placeholder="Search..."
          isLoading={loadingSuggestions}
          onQueryChange={handleQueryChange}
          onSelect={handleSelect}
          onSearch={handleSearch}
        />

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
            <SwitchCollectionContent
              isLoading={isLoading}
              isError={isError}
              switches={switches}
              setSelectedSwitch={setSelectedSwitch}
              setOpen={setOpen}
            />
          </div>
          <div ref={loadMoreRef} className="h-16" />
        </div>
      </div>

      <Dialog open={open} onOpenChange={() => setOpen(false)}>
        <SwitchDetailsContent details={selectedSwitch} />
      </Dialog>
    </div>
  );
}
