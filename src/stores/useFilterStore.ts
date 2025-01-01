import { create } from "zustand";

export type SelectedFilters = Record<string, Record<string, boolean>>;

interface FilterStore {
  selectedFilters: SelectedFilters;
  toggleFilter: (group: string, filter: string) => void;
  resetFilters: () => void;
  searchInput: string;
  setSearchInput: (input: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useFiltersStore = create<FilterStore>((set) => ({
  selectedFilters: {},
  toggleFilter: (group, filter) =>
    set((state) => {
      const newFilters = { ...state.selectedFilters };

      if (!newFilters[group]) {
        newFilters[group] = {};
      }
      newFilters[group][filter] = !newFilters[group][filter];
      return { selectedFilters: newFilters };
    }),
  resetFilters: () => set({ selectedFilters: {} }),
  searchInput: "",
  setSearchInput: (input) => set({ searchInput: input }),
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
