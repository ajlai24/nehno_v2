"use client";

import { AutoComplete } from "@/components/Autocomplete";
import { SwitchSort } from "./SwitchSort";
import { useSwitches } from "@/hooks/use-switches";
import { useSwitchSearch } from "../hooks/useSwitchSearch";

export function SwitchToolbar() {
  const { searchSuggestions, loadingSuggestions, handleQueryChange } =
    useSwitches();

  const { handleSelect, handleSearch } = useSwitchSearch();

  return (
    <div className="flex gap-2 items-center">
      <SwitchSort />
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
  );
}
