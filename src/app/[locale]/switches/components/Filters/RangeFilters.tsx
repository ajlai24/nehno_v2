import { SwitchFilters } from "../../types/filters";
import { RangeFilter } from "./RangeFilter";
import { isRangeFilter, rangeFilterConfig } from "./filter-utils";

interface RangeFilterProps {
  filters: SwitchFilters;
}
export function RangeFilters({ filters }: RangeFilterProps) {
  return (
    <div className="space-y-6">
      {Object.entries(filters).map(([key, value]) => {
        if (!isRangeFilter(value)) {
          return null;
        }

        const config = rangeFilterConfig[key as keyof typeof rangeFilterConfig];

        return (
          <RangeFilter
            key={key}
            name={key}
            label={config?.label ?? key}
            tooltip={config?.tooltip}
            min={config?.min ?? value.min}
            max={config?.max ?? value.max}
            defaultMin={value.min}
            defaultMax={value.max}
          />
        );
      })}
    </div>
  );
}
