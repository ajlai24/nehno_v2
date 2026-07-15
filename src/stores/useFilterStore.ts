import { create } from "zustand";

export type SelectedFilters = Record<string, Record<string, boolean>>;

export interface RangeFilter {
  min: number;
  max: number;
  inputMin: string;
  inputMax: string;
}

export type FilterRangeConfig = Record<
  string,
  {
    min: number;
    max: number;
  }
>;

interface FilterStore {
  selectedFilters: SelectedFilters;
  toggleFilter: (group: string, filter: string) => void;

  rangeFilters: Record<string, RangeFilter>;
  
  initializeRangeFilters: (
    filters: FilterRangeConfig
  ) => void;
  setRangeFilter: (
    name: string,
    values: Partial<RangeFilter>
  ) => void;

  appliedRangeFilters: Record<string, RangeFilter>;
  applyRangeFilters: () => void;

  resetFilters: () => void;

  searchInput: string;
  setSearchInput: (input: string) => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;

  selectedSortValue: string;
  setSelectedSortValue: (value: string) => void;
}

const emptyRangeFilters = (
  ranges: FilterRangeConfig
): Record<string, RangeFilter> => {
  return Object.fromEntries(
    Object.entries(ranges).map(([key, value]) => [
      key,
      {
        min: value.min,
        max: value.max,
        inputMin: String(value.min),
        inputMax: String(value.max),
      },
    ])
  );
};

export const useFiltersStore = create<FilterStore>((set) => ({
  selectedFilters: {},

  toggleFilter: (group, filter) =>
    set((state) => ({
      selectedFilters: {
        ...state.selectedFilters,
        [group]: {
          ...state.selectedFilters[group],
          [filter]:
            !state.selectedFilters[group]?.[filter],
        },
      },
    })),

  rangeFilters: {},

  initializeRangeFilters: (filters) =>
    set({
      rangeFilters: emptyRangeFilters(filters),
    }),

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

  appliedRangeFilters: {},
  applyRangeFilters: () =>
    set((state) => ({
      appliedRangeFilters: state.rangeFilters,
    })),

  resetFilters: () =>
    set((state) => ({
      selectedFilters: {},

      rangeFilters: Object.fromEntries(
        Object.entries(state.rangeFilters).map(
          ([key, value]) => [
            key,
            {
              ...value,
              inputMin: String(value.min),
              inputMax: String(value.max),
            },
          ]
        )
      ),
    })),

  searchInput: "",
  setSearchInput: (input) =>
    set({ searchInput: input }),

  searchQuery: "",
  setSearchQuery: (query) =>
    set({ searchQuery: query }),

  selectedSortValue: "name_asc",
  setSelectedSortValue: (value) =>
    set({ selectedSortValue: value }),
}));
