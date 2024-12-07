"use client";

import * as React from "react";
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname } from "next/navigation";

export function Navigation() {
  const pathname = usePathname();

  const tabs = [
    { label: "Home", route: "/" },
    { label: "About", route: "/about" },
    // { label: "Contact", route: "/contact" },
  ];

  const activeTab =
    tabs.find((tab) => tab.route === pathname)?.label || tabs[0].label;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-border">
      <div className="flex h-14 items-center px-4">
        <Tabs className="mr-4" value={activeTab}>
          <TabsList className="">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.route} value={tab.label} asChild>
                <Link href={tab.route}>{tab.label}</Link>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="flex flex-1 items-center justify-end gap-2">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
