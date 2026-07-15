export const getSearchSuggestions = async (searchInput: string) => {
  const response = await fetch(
    `/api/switches/search?query=${encodeURIComponent(searchInput)}`,
  );

  if (!response.ok) {
    throw new Error("Error fetching search suggestions");
  }

  return response.json();
};
