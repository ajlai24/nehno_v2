export type FilterValues =
  | string[]
  | {
      min: number;
      max: number;
    };

export type SwitchFilters = Record<string, FilterValues>;
