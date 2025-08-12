"use client";

import { APP_DOMAIN, cn, createHref, siteSettings } from "@workspace/utils";
import { ChevronDown, Menu, X } from "lucide-react";
import { ElementType, useEffect, useState } from "react";
import { AnimatedSizeContainer } from "../animated-size-container.tsx";
import { navItems, type NavTheme } from "./nav.tsx";
import { ModeSwitcher } from "@workspace/ui";
// import { LanguageSwitcher } from "@workspace/ui";
import { FontControls } from "./FontControls.tsx";

export function NavMobile({ theme = "light" }: { theme?: NavTheme }) {
  const [open, setOpen] = useState(false);
  // prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [open]);

  return (
    <div className={cn(theme === "dark" && "dark")}>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "fixed left-3 top-[0.6rem] z-40 rounded-full p-2 transition-colors duration-200 hover:bg-gray-200 focus:outline-none active:bg-gray-300 lg:hidden dark:hover:bg-white/20 dark:active:bg-white/30",
          open && "hover:bg-gray-100 active:bg-gray-200",
        )}
      >
        {open ? (
          <X className="h-5 w-5 text-gray-600 dark:text-white/70" />
        ) : (
          <Menu className="h-5 w-5 text-gray-600 dark:text-white/70" />
        )}
      </button>
      <nav
        className={cn(
          "fixed inset-0 z-20 hidden w-full bg-white px-5 py-16 lg:hidden dark:bg-black dark:text-white/70",
          open && "block",
        )}
      >
        <ul className="grid divide-y divide-gray-200 dark:divide-white/[0.15]">
          {navItems.map(({ name, href, childItems }, idx) => (
            <MobileNavItem
              key={idx}
              name={name}
              href={href}
              childItems={childItems}
              setOpen={setOpen}
            />
          ))}
          {/* 
          {session && Object.keys(session).length > 0 ? (
            <li className="py-3">
              <a
                href={APP_DOMAIN}
                className="flex w-full font-semibold capitalize"
              >
                Dashboard
              </a>
            </li>
          ) : ( */}
          {/* <> */}
          {/* <li className="py-3">
                <a
                  href={`${APP_DOMAIN}/login`}
                  className="flex w-full font-semibold capitalize"
                >
                  Log in
                </a>
              </li>

              <li className="py-3">
                <a
                  href={`${APP_DOMAIN}/register`}
                  className="flex w-full font-semibold capitalize"
                >
                  Sign Up
                </a>
              </li> */}
          {/* </> */}
          {/* )} */}
          {/* <li className="py-3">
            <div className="flex items-center justify-between gap-2 px-4">
              <ModeSwitcher />
              <LanguageSwitcher />
            </div>
          </li>
          <li className="py-3">
            <FontControls
              onSpacingChange={handleSpacingChange}
              onFontSizeChange={handleFontSizeChange}
              currentSpacing={settings.spacing}
              currentFontSize={settings.fontSize}
            />
          </li> */}
        </ul>
      </nav>
    </div>
  );
}

const MobileNavItem = ({
  name,
  href,
  childItems,
  setOpen,
}: {
  name: string;
  href?: string;
  childItems?: {
    title: string;
    description: string;
    href: string;
    // icon: ElementType;
    iconClassName?: string;
  }[];
  setOpen: (open: boolean) => void;
}) => {
  const domain = siteSettings.domain;
  const [expanded, setExpanded] = useState(false);

  if (childItems) {
    return (
      <li className="py-3">
        <AnimatedSizeContainer height>
          <button
            className="flex w-full justify-between"
            onClick={() => setExpanded(!expanded)}
          >
            <p className="font-semibold">{name}</p>
            <ChevronDown
              className={cn(
                "h-5 w-5 text-gray-500 transition-all dark:text-white/50",
                expanded && "rotate-180",
              )}
            />
          </button>
          {expanded && (
            <div className="grid gap-4 overflow-hidden py-4">
              {childItems.map(({ title, href, description }) => (
                <a
                  key={href}
                  href={createHref(href, domain, {
                    utm_source: "Custom Domain",
                    utm_medium: "Navbar",
                    utm_campaign: domain,
                    utm_content: title,
                  })}
                  onClick={() => setOpen(false)}
                  className="flex w-full gap-3"
                >
                  {/* <div className="flex size-10 items-center justify-center ">
                    <Icon className="size-5 text-neutral-700 dark:text-neutral-50" />
                  </div> */}
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="font-medium text-neutral-900 dark:text-neutral-100">
                        {title}
                      </h5>
                    </div>
                    <p className="text-[0.9rem] text-neutral-500 dark:text-neutral-300">
                      {description}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </AnimatedSizeContainer>
      </li>
    );
  }

  if (!href) {
    return null;
  }

  return (
    <li className="py-3">
      <a
        href={createHref(href, domain, {
          utm_source: "Custom Domain",
          utm_medium: "Navbar",
          utm_campaign: domain,
          utm_content: name,
        })}
        onClick={() => setOpen(false)}
        className="flex w-full font-semibold capitalize"
      >
        {name}
      </a>
    </li>
  );
};
