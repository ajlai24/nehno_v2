"use client";

import * as React from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSelectedLayoutSegment } from "next/navigation";
import { Icons } from "@/components/ui/icons";
import NavigationLink from "@/components/NavigationLink";

export function Navigation() {
  const selectedLayoutSegment = useSelectedLayoutSegment();
  const pathname = selectedLayoutSegment ? `/${selectedLayoutSegment}` : "/";

  const tabs = [
    { label: "Home", route: "/" },
    { label: "Blog", route: "/blog" },
    { label: "Switches", route: "/switches" },
    { label: "Chat", route: "/chat" },
  ];

  const activeTab =
    tabs.find((tab) =>
      tab.route === "/" ? pathname === "/" : pathname.startsWith(tab.route)
    ) || tabs[0];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-border">
      <div className="flex h-14 items-center px-4 gap-4">
        <NavigationLink href="/">
          <Icons.logo className="h-6 w-6" />
        </NavigationLink>
        <Tabs className="mr-4" value={activeTab.label}>
          <TabsList>
            {tabs.map((tab) => (
              <TabsTrigger key={tab.route} value={tab.label} asChild>
                <NavigationLink href={tab.route}>{tab.label}</NavigationLink>
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
