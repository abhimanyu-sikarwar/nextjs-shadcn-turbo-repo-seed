import { createHref, siteSettings } from "@workspace/utils";
import { cn } from "../lib/utils.ts";

export function Wordmark({ className }: { className?: string }) {
  let domain = siteSettings.domain;

  return (
    <a
      className={cn("block flex w-fit py-1 pr-2 items-center gap-2", className)}
      href={createHref("/", domain, {
        utm_source: "Wordmark",
        utm_medium: "Navbar",
        utm_campaign: domain,
        utm_content: "Logo",
      })}
    >
      <img
        src="/logo.png"
        width="45"
        height="45"
        alt={`${siteSettings.siteName} logo`}
        className="nav_logo"
      />
      {siteSettings.siteName}
    </a>
  );
}
