import { Checkbox } from "@/components/ui/checkbox";
import { useFiltersStore } from "@/stores/useFilterStore";

interface CheckboxFiltersProps {
  group: string;
  filters: string[];
}

export function CheckboxFilters({
  group,
  filters,
}: CheckboxFiltersProps) {
  const {
    selectedFilters,
    toggleFilter,
    setSearchInput,
    setSearchQuery,
  } = useFiltersStore();

  const handleChange = (filter: string) => {
    setSearchInput("");
    setSearchQuery("");
    toggleFilter(group, filter);
  };

  return (
    <>
      {filters.map((filter) => (
        <div
          key={filter}
          className="flex items-center space-x-2 pb-2"
        >
          <Checkbox
            className="w-6 h-6"
            id={`${group}-${filter}`}
            checked={
              selectedFilters[group]?.[filter] ?? false
            }
            onCheckedChange={() =>
              handleChange(filter)
            }
          />

          <label
            htmlFor={`${group}-${filter}`}
            className="font-medium cursor-pointer"
          >
            {filter}
          </label>
        </div>
      ))}
    </>
  );
}
