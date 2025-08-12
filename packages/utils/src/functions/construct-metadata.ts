import { Metadata } from "next";
import { HOME_DOMAIN, siteSettings } from "../constants";

export function constructMetadata({
  title,
  fullTitle,
  description = siteSettings.description,
  image = siteSettings.image,
  video,
  icons = siteSettings.icons,
  canonicalUrl,
  keywords = siteSettings.keywords,
  noIndex = false,
}: {
  title?: string;
  fullTitle?: string;
  description?: string;
  image?: string | null;
  video?: string | null;
  icons?: Metadata["icons"];
  canonicalUrl?: string;
  keywords?: Metadata["keywords"];
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title:
      fullTitle ||
      (title ? `${title} | ${siteSettings.name}` : siteSettings.name),
    description,
    openGraph: {
      title,
      description,
      ...(image && { images: image }),
      ...(video && { videos: video }),
    },
    twitter: {
      title,
      description,
      ...(image && {
        card: "summary_large_image",
        images: [image],
      }),
      ...(video && { player: video }),
      creator: "@abhimanyu",
    },
    // include favicon.ico as the shortcut icon (and fallback for other icon types)
    icons,
    keywords,
    metadataBase: new URL(HOME_DOMAIN),
    ...(canonicalUrl && {
      alternates: {
        canonical: canonicalUrl,
      },
    }),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
