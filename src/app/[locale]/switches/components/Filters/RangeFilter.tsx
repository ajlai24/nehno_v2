"use client";

import { SliderRange } from "@/components/SliderRange";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useFiltersStore } from "@/stores/useFilterStore";
import { parseNumeric } from "@/utils/parse-util";
import debounce from "lodash.debounce";
import { Info } from "lucide-react";
import { useCallback, useEffect, useMemo } from "react";

interface RangeFilterProps {
  name: string;
  label: string;
  min: number;          // slider lower bound
  max: number;          // slider upper bound
  defaultMin: number;   // selected starting value
  defaultMax: number;   // selected starting value
  step?: number;
  tooltip?: string;
}

export function RangeFilter({
  name,
  label,
  defaultMin,
  defaultMax,
  min,
  max,
  step = 1,
  tooltip,
}: RangeFilterProps) {
  const {
    rangeFilters,
    setRangeFilter,
    setSearchInput,
    setSearchQuery,
  } = useFiltersStore();

  const filter = rangeFilters[name];

  const setMin = useCallback(
    (value: number) => {
      setRangeFilter(name, {
        min: value,
        inputMin: value.toString(),
      });
    },
    [name, setRangeFilter]
  );

  const setMax = useCallback(
    (value: number) => {
      setRangeFilter(name, {
        max: value,
        inputMax: value.toString(),
      });
    },
    [name, setRangeFilter]
  );

  const debouncedSetMin = useDebouncedSetter(setMin);
  const debouncedSetMax = useDebouncedSetter(setMax);

  const handleSliderChange = (values: number[]) => {
    setSearchInput("");
    setSearchQuery("");

    debouncedSetMin(values[0]);
    debouncedSetMax(values[1]);

    setRangeFilter(name, {
      inputMin: values[0].toString(),
      inputMax: values[1].toString(),
    });
  };

  const handleMinChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;

    setRangeFilter(name, {
      inputMin: value,
    });

    const numericValue = parseNumeric(value);

    debouncedSetMin(
      numericValue <= filter.max ? numericValue : filter.max
    );
  };

  const handleMaxChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;

    setRangeFilter(name, {
      inputMax: value,
    });

    const numericValue = parseNumeric(value);

    debouncedSetMax(
      numericValue >= filter.min ? numericValue : filter.min
    );
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    type: "min" | "max"
  ) => {
    if (e.key !== "Enter") return;

    e.preventDefault();

    const value = parseNumeric(
      type === "min"
        ? filter.inputMin
        : filter.inputMax
    );

    if (type === "min") {
      setMin(value <= filter.max ? value : filter.max);
    } else {
      setMax(value >= filter.min ? value : filter.min);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-1">
        <span>{label}</span>

        {tooltip && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>

            <TooltipContent>
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      <div className="pr-2">
        <SliderRange
          value={[
            filter.min,
            filter.max,
          ]}
          defaultValue={[
            defaultMin,
            defaultMax,
          ]}
          minStepsBetweenThumbs={1}
          min={min}
          max={max}
          step={step}
          onValueChange={handleSliderChange}
          className="py-4"
        />
      </div>

      <div className="flex justify-between gap-2 px-1">
        <div>
          <label className="text-neutral-500">
            Min
          </label>

          <Input
            value={filter.inputMin}
            onChange={handleMinChange}
            onKeyDown={(e) =>
              handleKeyPress(e, "min")
            }
          />
        </div>

        <div>
          <label className="text-xs text-neutral-500">
            Max
          </label>

          <Input
            value={filter.inputMax}
            onChange={handleMaxChange}
            onKeyDown={(e) =>
              handleKeyPress(e, "max")
            }
          />
        </div>
      </div>
    </div>
  );
}

function useDebouncedSetter<T>(
  setter: (value: T) => void,
  delay = 500
) {
  const debouncedSetter = useMemo(
    () => debounce(setter, delay),
    [setter, delay]
  );

  useEffect(() => {
    return () => debouncedSetter.cancel();
  }, [debouncedSetter]);

  return debouncedSetter;
}