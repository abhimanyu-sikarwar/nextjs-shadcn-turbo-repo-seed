import { HOME_DOMAIN, siteSettings } from "../constants";

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export const generateBreadcrumbList = (items: BreadcrumbItem[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

export interface ArticleJsonLdInput {
  headline: string;
  description: string;
  url: string;
  images?: string[];
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
}

export const generateArticleJsonLd = (data: ArticleJsonLdInput) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: data.headline,
  description: data.description,
  url: data.url,
  ...(data.images && { image: data.images }),
  ...(data.datePublished && { datePublished: data.datePublished }),
  ...(data.dateModified && { dateModified: data.dateModified }),
  ...(data.authorName && {
    author: {
      "@type": "Person",
      name: data.authorName,
    },
  }),
});

const { name, canonical, image, description } = siteSettings;
export const jsonLd: Record<string, any> = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  url: canonical ?? HOME_DOMAIN,
  name: name,
  headline: name,
  description,
  ...(image && {
    image: {
      "@type": "ImageObject",
      url: image,
    },
  }),
  publisher: {
    "@type": "Organization",
    name: siteSettings.name,
    ...(siteSettings.logo && {
      logo: {
        "@type": "ImageObject",
        url: siteSettings.logo.url,
      },
    }),
  },
  // you can add datePublished, dateModified, author, etc. here if available
};
