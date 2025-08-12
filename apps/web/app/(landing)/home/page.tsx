import { MaxWidthWrapper } from "@workspace/ui";
import { maxWidthWrapperClassName, siteSettings } from "@workspace/utils";
import { cn } from "@workspace/utils";
import type { Metadata } from "next";
import {
  constructMetadata,
  generateBreadcrumbList,
  jsonLd,
} from "@workspace/utils";
import { Homepage } from "@/components/Home";

export const metadata: Metadata = constructMetadata({
  title: "Home",
  description: siteSettings.description,
  canonicalUrl: siteSettings.canonical,
});

export default function LandingPage() {
  const breadcrumb = generateBreadcrumbList([
    { name: "Home", url: siteSettings.canonical },
  ]);

  return (
    <div className="">
      <MaxWidthWrapper className={cn("relative", maxWidthWrapperClassName)}>
        <Homepage />
      </MaxWidthWrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumb).replace(/</g, "\\u003c"),
        }}
      />
    </div>
  );
}
