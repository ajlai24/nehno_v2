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

interface FilterPanelProps {
  filters: Record<string, string[]>;
}

export function FilterPanel({ filters }: FilterPanelProps) {
  const t = useTranslations("Filters");
  const filterGroups = Object.keys(filters);

  const { selectedFilters, toggleFilter, resetFilters } = useFiltersStore();

  const handleCheckboxChange = (group: string, filter: string) => {
    toggleFilter(group, filter);
  };

  return (
    <div className="pb-12">
      <div className="space-y-4 py-4">
        <div className="py-2 pr-2">
          <div className="flex justify-between items-center align-middle">
            <h2 className="mb-2 text-lg font-semibold tracking-tight">
              {t("title")}
            </h2>
            <Button onClick={resetFilters} variant="secondary" size="sm">
              Reset
            </Button>
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
                          id={filter}
                          checked={selectedFilters[group]?.has(filter) || false}
                          onCheckedChange={() => {
                            handleCheckboxChange(group, filter);
                          }}
                        />
                        <label
                          htmlFor={filter}
                          className="text-sm font-medium leading-none cursor-pointer"
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
