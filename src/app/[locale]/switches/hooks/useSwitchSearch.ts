import { Option } from "@/components/Autocomplete";
import { useFiltersStore } from "@/stores/useFilterStore";

export function useSwitchSearch() {
  const { resetFilters, setSearchQuery } = useFiltersStore();

  const handleSelect = (option?: Option) => {
    resetFilters();

    setSearchQuery(option?.label ?? "");
  };

  const handleSearch = (value: string) => {
    resetFilters();
    setSearchQuery(value);
  };

  const resetSearch = () => {
    resetFilters();
    setSearchQuery("");
  };

  return {
    handleSelect,
    handleSearch,
    resetSearch,
  };
}
