import { useInfiniteQuery } from "@tanstack/react-query";
import { useFiltersStore } from "@/stores/useFilterStore";
import { useMemo } from "react";

export function useSwitchQuery() {
  const {
    searchQuery,
    selectedFilters,
    appliedRangeFilters,
    selectedSortValue,
  } = useFiltersStore();

  const queryType = useMemo(() => {
    if (searchQuery) return "search";

    const hasSelectedFilters = Object.values(selectedFilters).some((group) =>
      Object.values(group).some(Boolean),
    );

    const hasRangeFilters = Object.values(appliedRangeFilters).some(
      (filter) => filter.min !== 0 || filter.max !== 100,
    );

    return hasSelectedFilters || hasRangeFilters ? "filtered" : "all";
  }, [searchQuery, selectedFilters, appliedRangeFilters]);

  return useInfiniteQuery({
    queryKey: [
      "switches",
      queryType,
      appliedRangeFilters,
      selectedFilters,
      searchQuery,
      selectedSortValue,
    ],

    queryFn: async ({ pageParam = 0 }) => {
      const params = new URLSearchParams({
        page: String(pageParam),
        queryType,
        searchQuery,
        rangeFilters: JSON.stringify(appliedRangeFilters),
        filters: JSON.stringify(selectedFilters),
        sort: selectedSortValue,
      });

      const res = await fetch(`/api/switches?${params}`);

      if (!res.ok) {
        throw new Error("Failed to fetch switches");
      }

      return res.json();
    },

    initialPageParam: 0,

    getNextPageParam: (lastPage, _pages, lastPageParam) => {
      const next = lastPageParam + 1;

      return next >= lastPage.totalPages ? undefined : next;
    },
  });
}
