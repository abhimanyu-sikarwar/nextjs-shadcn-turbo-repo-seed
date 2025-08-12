import React from "react";
import LandingPage from "./home/page";
import type { Metadata } from "next";
import {
  constructMetadata,
  generateBreadcrumbList,
  siteSettings,
  jsonLd,
} from "@workspace/utils";

export const metadata: Metadata = constructMetadata({
  title: "Home",
  description: siteSettings.description,
  canonicalUrl: siteSettings.canonical,
});

export default function Page() {
  const breadcrumb = generateBreadcrumbList([
    { name: "Home", url: siteSettings.canonical },
  ]);
  return (
    <>
      <LandingPage />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
