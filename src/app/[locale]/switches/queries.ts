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
  forceMin = 0,
  forceMax = 100,
}: {
  pageParam?: number;
  queryType?: "filtered" | "search" | "all";
  selectedFilters?: SelectedFilters;
  searchQuery?: string;
  forceMin?: number;
  forceMax?: number;
}) => {
  // Determine the correct offset range based on total count and requested page
  let offsetStart = pageParam * ITEMS_PER_PAGE;
  let offsetEnd = (pageParam + 1) * ITEMS_PER_PAGE - 1;

  // Fetch total count first, if possible, to prevent over-requesting
  const { data: totalData, error: countError } = await supabase
    .from("switches")
    .select("id", { count: "exact" })
    .gte("force", forceMin)
    .lte("force", forceMax);

  if (countError) {
    throw new Error("Error fetching total count");
  }

  const totalCount = totalData?.length || 0;

  // Check if the requested range exceeds the available data
  if (offsetStart >= totalCount) {
    offsetStart = totalCount - 1; // If the offset exceeds the total, set it to the last row.
    offsetEnd = totalCount - 1; // End at the last available row.
  }

  if (offsetEnd >= totalCount) {
    offsetEnd = totalCount - 1; // Ensure the end does not exceed the total count.
  }

  // Apply search if queryType is "search"
  if (queryType === "search" && searchQuery) {
    const { data: switches, error } = await supabase.rpc("search_switches", {
      query: searchQuery,
      page: pageParam,
      items_per_page: ITEMS_PER_PAGE,
    });

    if (error) {
      throw new Error("Error fetching search results");
    }

    const totalPages = totalCount ? Math.ceil(totalCount / ITEMS_PER_PAGE) : 0;

    return { switches, totalPages, totalCount };
  }

  // Fetch all switches if no filters are provided
  let query = supabase
    .from("switches")
    .select("*", { count: "exact" })
    .range(offsetStart, offsetEnd)
    .gte("force", forceMin)
    .lte("force", forceMax);

  // Apply filters if provided
  if (queryType === "filtered") {
    if (selectedFilters) {
      for (const group in selectedFilters) {
        const activeFilters = Object.keys(selectedFilters[group]).filter(
          (filter) => selectedFilters[group][filter]
        );

        if (activeFilters.length > 0) {
          query = query.in(group, activeFilters);
        }
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
