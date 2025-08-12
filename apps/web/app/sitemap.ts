import { SHORT_DOMAIN } from "@workspace/utils";
import { MetadataRoute } from "next";
import { headers } from "next/headers";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headersList = headers();
  let domain = "localhost:3000";

  // if (domain === "flow.localhost:3000" || domain.endsWith(".vercel.app")) {
  //   // for local development and preview URLs
  //   domain = SHORT_DOMAIN;
  // }

  return [
    {
      url: `https://${domain}`,
      lastModified: new Date(),
    },
  ];
}
