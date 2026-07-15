import { Tables } from "@/utils/supabase/supabase.types";

export const getSearchSuggestions = async (
  searchInput: string,
): Promise<Tables<"switches">[]> => {
  const response = await fetch(
    `/api/switches/search?query=${encodeURIComponent(searchInput)}`,
  );

  if (!response.ok) {
    throw new Error("Error fetching search suggestions");
  }

  return response.json();
};
