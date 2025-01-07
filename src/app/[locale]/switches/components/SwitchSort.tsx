"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFiltersStore } from "@/stores/useFilterStore";

export function SwitchSort() {
  const { selectedSortValue, setSelectedSortValue } = useFiltersStore();

  const handleSelectChange = (value: string) => {
    setSelectedSortValue(value);
  };

  return (
    <Select value={selectedSortValue} onValueChange={handleSelectChange}>
      <SelectTrigger>
        <SelectValue placeholder="Sort" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Sort</SelectLabel>
          <SelectItem value="name_asc">Name: A-Z</SelectItem>
          <SelectItem value="name_desc">Name: Z-A</SelectItem>
          <SelectItem value="force_desc">Force (gf): High to Low</SelectItem>
          <SelectItem value="force_asc">Force (gf): Low to High</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
