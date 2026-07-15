export type FilterValues =
  | string[]
  | {
      min: number;
      max: number;
    };

export const isRangeFilter = (
  value: FilterValues,
): value is { min: number; max: number } => {
  return !Array.isArray(value) && "min" in value && "max" in value;
};

export const isCheckboxFilter = (key: string) => {
  return ["feel", "brand"].includes(key);
};

interface RangeFilterConfig {
  label: string;
  min: number;
  max: number;
  tooltip?: string;
}

export const rangeFilterConfig: Record<string, RangeFilterConfig> = {
  force: {
    label: "Actuation Force (gf)",
    min: 0,
    max: 100,
    tooltip:
      "(Operating Force) Minimum pressure needed for a keypress to register on your screen measured in grams-force (gf).",
  },
  bottomOutForce: {
    label: "Bottom Out Force (gf)",
    min: 0,
    max: 150,
    tooltip:
      "Force required to push the switch all the way down until it physically stops.",
  },
  tactileForce: {
    label: "Tactile Force (gf)",
    min: 0,
    max: 100,
    tooltip: `On both tacile and clicky switches - the peak force you must overcome to get past the "bump" located halfway down the switch`,
  },
};
