"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useFiltersStore } from "@/stores/useFilterStore";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { CheckboxFilters } from "./CheckboxFilters";
import {
  FilterValues,
  isCheckboxFilter,
  isRangeFilter,
} from "./filter-utils";
import { FilterHeader } from "./FilterHeader";
import { RangeFilters } from "./RangeFilters";

interface FilterPanelProps {
  className?: string;
  filters: Record<string, FilterValues>;
  onResetFilters?: () => void;
  closeDrawer?: () => void;
}

export function FilterPanel({
  className,
  filters,
  onResetFilters,
  closeDrawer,
}: FilterPanelProps) {

  const t = useTranslations("Filters");

  const {
    resetFilters,
    setSearchInput,
    setSearchQuery,
    setRangeFilter,
  } = useFiltersStore();

  useEffect(() => {
    Object.entries(filters).forEach(([key, value]) => {
      if (isRangeFilter(value)) {
        setRangeFilter(key, {
          min: value.min,
          max: value.max,
          inputMin: String(value.min),
          inputMax: String(value.max),
        });
      }
    });
  }, [filters, setRangeFilter]);

  const handleReset = () => {
    resetFilters();
    setSearchInput("");
    setSearchQuery("");
    onResetFilters?.();
  };

  const keys = Object.keys(filters);
  const checkboxFilters = Object.fromEntries(
    Object.entries(filters).filter(([key, value]) =>
      isCheckboxFilter(key)
    )
  ) as Record<string, string[]>;

  const rangeFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, value]) =>
      isRangeFilter(value)
    )
  );

  return (
    <div className={`pb-12 ${className}`}>
      <FilterHeader
        title={t("title")}
        onReset={handleReset}
        closeDrawer={closeDrawer}
      />
      <Accordion
        type="multiple"
        defaultValue={[
          ...keys,
          "ranges",
        ]}
      >
        {Object.entries(checkboxFilters).map(([group, values]) => (
          <AccordionItem key={group} value={group}>
            <AccordionTrigger className="font-semibold">
              {t(group)}
            </AccordionTrigger>

            <AccordionContent>
              <CheckboxFilters
                group={group}
                filters={values}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
        <AccordionItem value="ranges">
          <AccordionTrigger>
            Other
          </AccordionTrigger>
          <AccordionContent>
            <RangeFilters
              filters={rangeFilters}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
