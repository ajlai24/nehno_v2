"use client";

import { getSearchSuggestions } from "@/app/[locale]/switches/queries";
import { Option } from "@/components/Autocomplete";
import { useState } from "react";

export const useSwitches = () => {
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<Option[]>([]);

  // Fetch search suggestions based on input
  const handleQueryChange = async (searchInput: string) => {
    setLoadingSuggestions(true);

    const data = await getSearchSuggestions(searchInput);
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
  };

  return {
    searchSuggestions,
    loadingSuggestions,
    handleQueryChange,
  };
};
