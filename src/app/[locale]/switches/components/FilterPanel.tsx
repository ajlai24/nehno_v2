import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface FilterPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  filters: Record<string, string[]>;
}

export function FilterPanel({ className, filters }: FilterPanelProps) {
  const t = useTranslations("Filters");
  const filterGroups = Object.keys(filters);

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="py-2 pr-2">
          <h2 className="mb-2 text-lg font-semibold tracking-tight">
            {t("title")}
          </h2>
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
                        className="flex items-center space-x-2 pb-2"
                        key={filter}
                      >
                        <Checkbox id="terms" />
                        <label
                          htmlFor="terms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
