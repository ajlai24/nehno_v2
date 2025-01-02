"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useFiltersStore } from "@/stores/useFilterStore";
import debounce from "lodash.debounce";
import { useTranslations } from "next-intl";
import { useCallback, useEffect } from "react";
import { SliderRange } from "./SliderRange";
import { parseNumeric } from "@/utils/parse-util";

interface FilterPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  filters: Record<string, string[]> | Record<string, Record<string, number>>;
  onFilterChange?: () => void;
  onResetFilters?: () => void;
  closeDrawer?: () => void;
}

export function FilterPanel({
  className,
  filters,
  onFilterChange,
  onResetFilters,
  closeDrawer,
}: FilterPanelProps) {
  // Translation and state hooks
  const t = useTranslations("Filters");
  const {
    selectedFilters,
    toggleFilter,
    resetFilters,
    setSearchInput,
    setSearchQuery,
    inputMin,
    setInputMin,
    inputMax,
    setInputMax,
    forceMin,
    forceMax,
    setForceMin,
    setForceMax,
  } = useFiltersStore();

  // Effects
  useEffect(() => {
    if (
      filters?.force &&
      typeof filters.force === "object" &&
      !Array.isArray(filters.force)
    ) {
      const { min, max } = filters.force;
      setForceMin(min || 0);
      setInputMin(min?.toString() || "0");
      setForceMax(max || 100);
      setInputMax(max?.toString() || "100");
    }
  }, [filters, setForceMin, setForceMax, setInputMin, setInputMax]);

  useEffect(() => {
    if (onFilterChange && Object.keys(selectedFilters).length > 0) {
      onFilterChange();
    }
  }, [onFilterChange, selectedFilters, forceMin, forceMax]);

  // Handlers
  const handleCheckboxChange = async (group: string, filter: string) => {
    setSearchInput("");
    setSearchQuery("");
    await toggleFilter(group, filter);
  };

  const handleResetFilters = () => {
    resetFilters();
    setSearchInput("");
    setSearchQuery("");
    onResetFilters?.();
  };

  const handleForceChange = (values: number[]) => {
    setSearchInput("");
    setSearchQuery("");
    debouncedSetForceMin(values[0]);
    debouncedSetForceMax(values[1]);
    setInputMin(values[0].toString());
    setInputMax(values[1].toString());
  };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputMin(value);
    const numericValue = parseNumeric(value);
    debouncedSetForceMin(numericValue <= forceMax ? numericValue : forceMax);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputMax(value);
    const numericValue = parseNumeric(value);
    debouncedSetForceMax(numericValue >= forceMin ? numericValue : forceMin);
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    type: "min" | "max"
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const numericValue = parseNumeric(type === "min" ? inputMin : inputMax);
      if (type === "min") {
        setForceMin(numericValue <= forceMax ? numericValue : forceMax);
      } else {
        setForceMax(numericValue >= forceMin ? numericValue : forceMin);
      }
    }
  };

  // Debounced state updates for force min/max
  const debouncedSetForceMin = useCallback(
    debounce((value: number) => {
      setForceMin(value);
      setInputMin(value.toString());
    }, 500),
    []
  );

  const debouncedSetForceMax = useCallback(
    debounce((value: number) => {
      setForceMax(value);
      setInputMax(value.toString());
    }, 500),
    []
  );

  // Derived states using parseNumeric for min/max inputs
  const numericInputMin = parseNumeric(inputMin);
  const numericInputMax = parseNumeric(inputMax);

  const checkboxFilterKeys = ["feel", "brand"];
  const filterKeys = Object.keys(filters);
  const checkboxFilters = filterKeys.filter((key) =>
    checkboxFilterKeys.includes(key)
  );

  return (
    <div className={`pb-12 ${className}`}>
      <div className="space-y-4 py-4">
        <div className="py-2 pr-2">
          <div className="flex justify-between items-center align-middle">
            <h2 className="text-lg font-semibold tracking-tight">
              {t("title")}
            </h2>
            <div className="flex gap-2">
              <Button
                onClick={handleResetFilters}
                variant="secondary"
                size="sm"
              >
                Reset
              </Button>
              <Button size="sm" className="lg:hidden" onClick={closeDrawer}>
                Apply
              </Button>
            </div>
          </div>

          <div className="space-y-1">
            <Accordion defaultValue={filterKeys} type="multiple">
              {/* Render checkbox filters */}
              {checkboxFilters.map((group) => (
                <AccordionItem key={group} value={group}>
                  <AccordionTrigger className="font-semibold">
                    {t(group)}
                  </AccordionTrigger>
                  <AccordionContent>
                    {filters[group] &&
                      Array.isArray(filters[group]) &&
                      filters[group].map((filter) => (
                        <div
                          key={filter}
                          className="flex items-center space-x-2 pb-2"
                        >
                          <Checkbox
                            className="w-6 h-6 text-xl"
                            id={filter}
                            checked={selectedFilters[group]?.[filter] || false}
                            onCheckedChange={() =>
                              handleCheckboxChange(group, filter)
                            }
                          />
                          <label
                            htmlFor={filter}
                            className="font-medium leading-none cursor-pointer"
                          >
                            {filter}
                          </label>
                        </div>
                      ))}
                  </AccordionContent>
                </AccordionItem>
              ))}

              {/* Render other filters */}
              <AccordionItem value="force">
                <AccordionTrigger className="font-semibold">
                  Other
                </AccordionTrigger>
                <AccordionContent>
                  <div>Operation Force (gf)</div>
                  <div className="pr-2">
                    <SliderRange
                      value={[numericInputMin, numericInputMax]}
                      defaultValue={[forceMin, forceMax]}
                      minStepsBetweenThumbs={1}
                      max={100}
                      min={0}
                      step={1}
                      onValueChange={handleForceChange}
                      className="py-4"
                    />
                  </div>

                  <div className="flex justify-between gap-2 px-1">
                    <div>
                      <label className="text text-neutral-500">Min</label>
                      <Input
                        value={inputMin}
                        onChange={handleMinChange}
                        onKeyDown={(e) => handleKeyPress(e, "min")}
                      />
                    </div>

                    <div>
                      <label className="text-xs text-neutral-500">Max</label>
                      <Input
                        value={inputMax}
                        onChange={handleMaxChange}
                        onKeyDown={(e) => handleKeyPress(e, "max")}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}
