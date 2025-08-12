import { cn, createHref, NAVLINKS } from "@workspace/utils";
import { ContentLinkCard, getUtmParams } from "./shared.tsx";

export function ProductContent({ domain }: { domain: string }) {
  return (
    <div className="grid w-[720px]  divide-x divide-gray-200">
      {/* <div className="grid w-[720px] grid-cols-[minmax(0,1fr),0.4fr] divide-x divide-gray-200"> */}
      <div className="grid grow grid-rows-4 grid-cols-2 gap-4 p-4">
        {NAVLINKS.map(({ title, description, href }) => (
          <ContentLinkCard
            key={title}
            title={title}
            description={description}
            href={createHref(
              href,
              domain,
              getUtmParams({ domain, utm_content: title }),
            )}
          />
        ))}
      </div>
      {/* <div className="px-6 py-4">
        <p className={cn(contentHeadingClassName, "mb-2")}>Customer Stories</p>
        <div className="grid grid-cols-1">
          {CUSTOMER_STORIES.map(
            ({ icon: Icon, iconClassName, title, description, href }) => (
              <ContentLinkCard
                key={href}
                className="-mx-2"
                href={createHref(
                  href,
                  domain,
                  getUtmParams({ domain, utm_content: title }),
                )}
                icon={
                  <div className="shrink-0 rounded-[10px] border border-gray-200 bg-white/50 p-2 dark:border-white/20 dark:bg-white/10">
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0 text-gray-600 transition-colors dark:text-white/60",
                        iconClassName,
                      )}
                    />
                  </div>
                }
                title={title}
                description={description}
              />
            ),
          )}
          <ContentLinkCard
            className="-mx-2"
            href={createHref(
              "/customers",
              domain,
              getUtmParams({ domain, utm_content: "Customer Stories" }),
            )}
            title="View all stories"
            showArrow
          />
        </div>
      </div> */}
    </div>
  );
}
