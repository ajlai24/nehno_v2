import { create } from "zustand";

// Define the store
interface FilterStore {
  selectedFilters: Record<string, Set<string>>; // Track selected filters for each filter group
  toggleFilter: (group: string, filter: string) => void;
  resetFilters: () => void;
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
}));
