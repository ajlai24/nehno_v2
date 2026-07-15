import { create } from "zustand";

export type SelectedFilters = Record<string, Record<string, boolean>>;

export interface RangeFilter {
  min: number;
  max: number;
  inputMin: string;
  inputMax: string;
}

interface FilterStore {
  selectedFilters: SelectedFilters;
  toggleFilter: (group: string, filter: string) => void;

  rangeFilters: Record<string, RangeFilter>;
  setRangeFilter: (
    name: string,
    values: Partial<RangeFilter>
  ) => void;
  resetFilters: () => void;

  searchInput: string;
  setSearchInput: (input: string) => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;

  selectedSortValue: string;
  setSelectedSortValue: (value: string) => void;
}

export const useFiltersStore = create<FilterStore>((set) => ({
  selectedFilters: {},

  toggleFilter: (group, filter) =>
    set((state) => ({
      selectedFilters: {
        ...state.selectedFilters,
        [group]: {
          ...state.selectedFilters[group],
          [filter]: !state.selectedFilters[group]?.[filter],
        },
      },
    })),

  rangeFilters: {
    force: {
      min: 0,
      max: 100,
      inputMin: "0",
      inputMax: "100",
    },
  },

  setRangeFilter: (name, values) =>
    set((state) => ({
      rangeFilters: {
        ...state.rangeFilters,
        [name]: {
          ...state.rangeFilters[name],
          ...values,
        },
      },
    })),

  resetFilters: () =>
    set({
      selectedFilters: {},
      rangeFilters: {
        force: {
          min: 0,
          max: 100,
          inputMin: "0",
          inputMax: "100",
        },
      },
    }),

  searchInput: "",
  setSearchInput: (input) => set({ searchInput: input }),

  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),

  selectedSortValue: "name_asc",
  setSelectedSortValue: (value) =>
    set({ selectedSortValue: value }),
}));
