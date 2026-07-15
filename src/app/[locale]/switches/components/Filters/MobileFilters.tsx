"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Icons } from "@/components/ui/icons";
import { useState } from "react";
import { SwitchFilters } from "../../types/filters";
import { FilterPanel } from "./FilterPanel";

interface MobileFiltersProps {
  filters: SwitchFilters;
  onReset: () => void;
}

export function MobileFilters({ filters, onReset }: MobileFiltersProps) {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">
          <Icons.filter className="h-5 w-5" />
          <span>Filter</span>
        </Button>
      </DrawerTrigger>

      <DrawerTitle className="hidden">Filters</DrawerTitle>

      <DrawerContent>
        <div className="px-4 py-4">
          <FilterPanel
            filters={filters}
            onResetFilters={onReset}
            closeDrawer={() => setOpen(false)}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
