"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui";
// import { LanguageSwitcher } from "@workspace/ui"
import { ModeSwitcher } from "@workspace/ui";
import { Separator } from "@workspace/ui";
import { SidebarTrigger } from "@workspace/ui";
import { LucideIcon } from "lucide-react";
import { Fragment } from "react";

interface BreadcrumbItem {
  title: string;
  url?: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
}

interface PageHeaderProps {
  items: BreadcrumbItem[];
}

export function Header({ items }: PageHeaderProps) {
  return (
    <header className="flex h-12 justify-between shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {items.map((item, index) => (
              <Fragment key={index}>
                <BreadcrumbItem
                  className={index === 0 ? "hidden md:block" : ""}
                >
                  {index === items.length - 1 ? (
                    <BreadcrumbPage>{item.title}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={item.url}>
                      {item.title}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index < items.length - 1 && (
                  <BreadcrumbSeparator className="hidden md:block" />
                )}
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex items-center gap-2 px-4">
        <ModeSwitcher />
        {/* <LanguageSwitcher /> */}
      </div>
    </header>
  );
}
