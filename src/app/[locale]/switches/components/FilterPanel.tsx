"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useFiltersStore } from "@/stores/useFilterStore";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
// import { SliderRange } from "./SliderRange";
// import { Input } from "@/components/ui/input";

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
  const {
    selectedFilters,
    toggleFilter,
    resetFilters,
    setSearchInput,
    setSearchQuery,
  } = useFiltersStore();
  // const [forceMin, setForceMin] = useState<number>(0);
  // const [forceMax, setForceMax] = useState<number>(100);

  useEffect(() => {
    if (onFilterChange && Object.keys(selectedFilters).length > 0) {
      onFilterChange();
    }
  }, [onFilterChange, selectedFilters]);

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
              {checkboxFilters.map((group) => (
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
                          checked={selectedFilters[group]?.[filter] || false}
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

              {/* <AccordionItem value="force">
                <AccordionTrigger className="font-semibold">
                  Force and Distance
                </AccordionTrigger>
                <AccordionContent>
                  <div>Operation Force</div>
                  <SliderRange
                    defaultValue={[forceMin, forceMax]}
                    minStepsBetweenThumbs={1}
                    max={100}
                    min={0}
                    step={1}
                    // onValueChange={handleValueChange}
                    className="py-4"
                  />
                  <div className="flex justify-between gap-2">
                    <Input value={forceMin} onChange={() => {}} />
                    <Input value={forceMax} onChange={() => {}} />
                  </div>
                </AccordionContent>
              </AccordionItem> */}
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}
