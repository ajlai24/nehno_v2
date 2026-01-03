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
