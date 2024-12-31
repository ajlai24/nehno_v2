"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { useFiltersStore } from "@/stores/useFilterStore";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

interface FilterPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  filters: Record<string, string[]>;
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
  const t = useTranslations("Filters");
  const filterGroups = Object.keys(filters);

  const { selectedFilters, toggleFilter, resetFilters, setSearchInput } =
    useFiltersStore();

  useEffect(() => {
    if (onFilterChange && Object.keys(selectedFilters).length > 0) {
      onFilterChange();
    }
  }, [onFilterChange, selectedFilters]);

  const handleCheckboxChange = async (group: string, filter: string) => {
    setSearchInput("");
    await toggleFilter(group, filter);
  };

  const handleResetFilters = () => {
    resetFilters();
    setSearchInput("");
    onResetFilters?.();
  };

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
            <Accordion defaultValue={filterGroups} type="multiple">
              {filterGroups.map((group) => (
                <AccordionItem key={group} value={group}>
                  <AccordionTrigger className="font-semibold">
                    {t(group)}
                  </AccordionTrigger>
                  <AccordionContent>
                    {filters[group].map((filter) => (
                      <div
                        key={filter}
                        className="flex items-center space-x-2 pb-2"
                      >
                        <Checkbox
                          className="w-6 h-6 text-xl"
                          id={filter}
                          checked={selectedFilters[group]?.has(filter) || false}
                          onCheckedChange={() => {
                            handleCheckboxChange(group, filter);
                          }}
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
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}
