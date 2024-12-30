import { create } from "zustand";

interface FilterStore {
  selectedFilters: Record<string, Set<string>>;
  toggleFilter: (group: string, filter: string) => void;
  resetFilters: () => void;
  searchInput: string;
  setSearchInput: (input: string) => void;
}

export const useFiltersStore = create<FilterStore>((set) => ({
  selectedFilters: {},
  toggleFilter: (group, filter) =>
    set((state) => {
      const newFilters = { ...state.selectedFilters };
      if (!newFilters[group]) {
        newFilters[group] = new Set();
      }

      if (newFilters[group].has(filter)) {
        newFilters[group].delete(filter);
      } else {
        newFilters[group].add(filter);
      }

      return { selectedFilters: newFilters };
    }),
  resetFilters: () => set({ selectedFilters: {} }),
  searchInput: "",
  setSearchInput: (input) => set({ searchInput: input }),
}));
