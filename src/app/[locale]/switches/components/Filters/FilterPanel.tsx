"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useFiltersStore } from "@/stores/useFilterStore";
import { useTranslations } from "next-intl";
import { CheckboxFilters } from "./CheckboxFilters";
import { FilterValues, isCheckboxFilter, isRangeFilter } from "./filter-utils";
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

  const { resetFilters, setSearchInput, setSearchQuery } = useFiltersStore();

  const handleReset = () => {
    resetFilters();
    setSearchInput("");
    setSearchQuery("");
    onResetFilters?.();
  };

  const filterEntries = Object.entries(filters);

  const checkboxFilters = Object.fromEntries(
    filterEntries.filter(([key]) => isCheckboxFilter(key)),
  ) as Record<string, string[]>;

  const rangeFilters = Object.fromEntries(
    filterEntries.filter(([_, value]) => isRangeFilter(value)),
  ) as Record<
    string,
    {
      min: number;
      max: number;
    }
  >;

  const accordionValues = [
    ...Object.keys(checkboxFilters),
    ...(Object.keys(rangeFilters).length ? ["ranges"] : []),
  ];

  return (
    <div className={`pb-12 ${className ?? ""}`}>
      <FilterHeader
        title={t("title")}
        onReset={handleReset}
        closeDrawer={closeDrawer}
      />

      <Accordion type="multiple" defaultValue={accordionValues}>
        {Object.entries(checkboxFilters).map(([group, values]) => (
          <AccordionItem key={group} value={group}>
            <AccordionTrigger className="font-semibold">
              {t(group)}
            </AccordionTrigger>

            <AccordionContent>
              <CheckboxFilters group={group} filters={values} />
            </AccordionContent>
          </AccordionItem>
        ))}

        {Object.keys(rangeFilters).length > 0 && (
          <AccordionItem value="ranges">
            <AccordionTrigger className="font-semibold">Other</AccordionTrigger>

            <AccordionContent>
              <RangeFilters filters={rangeFilters} />
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  );
}
