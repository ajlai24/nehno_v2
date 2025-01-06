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
  inputMin: string;
  setInputMin: (value: string) => void;
  inputMax: string;
  setInputMax: (value: string) => void;
  forceMin: number;
  setForceMin: (value: number) => void;
  forceMax: number;
  setForceMax: (value: number) => void;
  selectedSortValue: string;
  setSelectedSortValue: (value: string) => void;
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
  resetFilters: () =>
    set({
      selectedFilters: {},
      forceMin: 0,
      forceMax: 100,
      inputMin: "0",
      inputMax: "100",
    }),
  searchInput: "",
  setSearchInput: (input) => set({ searchInput: input }),
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
  forceMin: 0,
  setForceMin: (value) => set({ forceMin: value }),
  forceMax: 100,
  setForceMax: (value) => set({ forceMax: value }),
  inputMin: "0",
  setInputMax: (value) => set({ inputMax: value }),
  inputMax: "100",
  setInputMin: (value) => set({ inputMin: value }),
  selectedSortValue: "name_asc",
  setSelectedSortValue: (value) => set({ selectedSortValue: value }),
}));
