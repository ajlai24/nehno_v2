import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

interface FilterPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  filters: Record<string, string[]>;
}

export function FilterPanel({ className, filters }: FilterPanelProps) {
  const filterGroups = Object.keys(filters);

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="py-2 pr-2">
          <h2 className="mb-2 text-lg font-semibold tracking-tight">Filters</h2>
          <div className="space-y-1">
            <Accordion defaultValue={filterGroups} type="multiple">
              {filterGroups.map((group) => (
                <AccordionItem key={group} value={group}>
                  <AccordionTrigger>{group}</AccordionTrigger>
                  <AccordionContent>
                    {filters[group].map((filter) => (
                      <div key={filter}>{filter}</div>
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
