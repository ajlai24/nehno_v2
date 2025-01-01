import { SelectedFilters } from "@/stores/useFilterStore";
import { ITEMS_PER_PAGE } from "@/utils/constants";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const getFilters = async () => {
  return await supabase.rpc("get_filters");
};

export const getSearchSuggestions = async (searchInput: string) => {
  let query = supabase.from("switches").select();
  query = query
    .or(
      `name.ilike.%${searchInput}%,brand.ilike.%${searchInput}%,series.ilike.%${searchInput}%`
    )
    .limit(5);

  const { data: searchSuggestions, error } = await query;

  if (error) {
    throw new Error("Error fetching search suggestions");
  }

  return searchSuggestions;
};

export const fetchSwitches = async ({
  pageParam = 0,
  queryType = "all",
  selectedFilters,
  searchQuery,
}: {
  pageParam?: number;
  queryType?: "filtered" | "search" | "all";
  selectedFilters?: SelectedFilters;
  searchQuery?: string;
}) => {
  // Apply search if queryType is "search"
  if (queryType === "search" && searchQuery) {
    const {
      data: switches,
      count,
      error,
    } = await supabase
      .rpc("search_switches", {
        query: searchQuery,
      })
      .range(pageParam * ITEMS_PER_PAGE, (pageParam + 1) * ITEMS_PER_PAGE - 1);

    if (error) {
      throw new Error("Error fetching search results");
    }

    const totalPages = count ? Math.ceil(count / ITEMS_PER_PAGE) : 0;
    return { switches, totalPages };
  }

  // Fetch all switches if no filters are provided
  let query = supabase
    .from("switches")
    .select("*", { count: "exact" })
    .range(pageParam * ITEMS_PER_PAGE, (pageParam + 1) * ITEMS_PER_PAGE - 1);

  // Apply filters if provided
  if (queryType === "filtered" && selectedFilters) {
    for (const group in selectedFilters) {
      const activeFilters = Object.keys(selectedFilters[group]).filter(
        (filter) => selectedFilters[group][filter]
      );

      if (activeFilters.length > 0) {
        query = query.in(group, activeFilters);
      }
    }
  }

  const { data: switches, count, error } = await query;

  if (error) {
    throw new Error("Error fetching switches");
  }

  const totalPages = count ? Math.ceil(count / ITEMS_PER_PAGE) : 0;
  return { switches, totalPages };
};
