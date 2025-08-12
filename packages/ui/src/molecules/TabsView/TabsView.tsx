// components/molecules/TabsView/TabsView.tsx
import React, { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui";

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
  icon?: React.ReactNode;
}

interface TabsViewProps {
  tabs: TabItem[];
  defaultValue?: string;
  variant?: "default" | "outline" | "pills";
  fullWidth?: boolean;
  className?: string;
  tabsListClassName?: string;
}

export const TabsView: React.FC<TabsViewProps> = ({
  tabs,
  defaultValue,
  variant = "default",
  fullWidth = true,
  className = "",
  tabsListClassName = "",
}) => {
  // Default to the first tab if no default is provided
  const activeTab = defaultValue || tabs[0]?.id || "";

  return (
    <Tabs defaultValue={activeTab} className={`w-full ${className}`}>
      <TabsList
        className={`${fullWidth ? "w-full" : ""} ${
          variant === "pills"
            ? "bg-transparent gap-2 p-1 mb-6"
            : variant === "outline"
              ? "bg-transparent border-b rounded-none mb-6"
              : "mb-6"
        } ${tabsListClassName}`}
      >
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className={`${fullWidth ? "flex-1" : ""} ${
              variant === "pills"
                ? "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"
                : variant === "outline"
                  ? "border-b-2 border-transparent data-[state=active]:border-primary rounded-none"
                  : ""
            }`}
          >
            <div className="flex items-center gap-2">
              {tab.icon && tab.icon}
              <span>{tab.label}</span>
            </div>
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};
