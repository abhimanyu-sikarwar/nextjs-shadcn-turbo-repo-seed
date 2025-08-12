export const siteSettings = {
  siteName: "siteName",
  node_env: process.env.NODE_ENV,
  name: "siteName",
  description: "Explore siteName!",
  domain: "sitename.com",
  youtubeDemoVideoUrl: "https://www.youtube.com/watch?v=VGMTqb_VDMY",
  canonical: "https://sitename.com/",
  lastUpdated: "2025-08-02T00:00:00Z",
  icons: [
    {
      rel: "apple-touch-icon",
      sizes: "32x32",
      url: "/logo.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "/logo.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: "/logo.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: "/logo.png",
    },
    {
      rel: "icon",
      type: "image/x-icon",
      sizes: "256x256",
      url: "/favicon.ico",
    },
  ],
  image: "/logo.png",
  keywords: ["sitename"],
  social: {
    twitter: { label: "X (Twitter)", url: "https://x.com" },
    facebook: { label: "Facebook", url: "https://facebook.com" },
    LinkedIn: {
      label: "LinkedIn",
      url: "https://www.linkedin.com/company/sitename/",
    },
    instagram: {
      label: "Instagram",
      url: "https://www.instagram.com/sitename?utm_source=sitename.com",
    },
    youtube: { label: "Youtube", url: "https://www.youtube.com/@siteName" },
    whatsapp: {
      label: "WhatsApp",
      url: "https://wa.me/message",
    },
  },
  creator: "Public Pacific",
  creatorUrl: "http://publicpacific.com/",
  author: [
    {
      name: "Public Pacific",
      url: "http://publicpacific.com/",
      address: "",
    },
    {
      name: "Abhimanyu sikarwar",
      url: "https://abhimanyusikarwar.com/",
      address: "",
    },
  ],
  logo: {
    url: "/logo.png",
    alt: "siteName",
    href: "/",
    width: 95,
    height: 30,
  },
  defaultLanguage: "en",
  appleWebApp: {
    capable: true,
    title: "siteName",
    statusBarStyle: "black-translucent",
  },
  verification: {
    other: { "google-adsense-account": "ca-pub" },
  },
  currencyCode: "INR",
  contact: {
    legalEmail: "legal@sitename.com",
    privacyEmail: "privacy@sitename.com",
    supportEmail: "support@sitename.com",
    email: "hello@sitename.com",
    phone: "+1234567890",
    address: "",
    whatsappUrl: "https://wa.me/message",
    whatsappNumber: "+1234567890",
  },
};

export const metadata = {
  title: {
    default: siteSettings.name,
    template: `%s - ${siteSettings.name}`,
  },
  metadataBase: new URL(siteSettings.canonical),
  description: siteSettings.description,
  keywords: [
    "Next.js",
    "React",
    "Tailwind CSS",
    "Server Components",
    "Radix UI",
  ],
  authors: [
    {
      name: "gang gangs",
      url: "https://ganggangs.com",
    },
  ],
  creator: "gang gangs",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteSettings.canonical,
    title: siteSettings.name,
    description: siteSettings.description,
    siteName: siteSettings.name,
    images: [siteSettings.logo],
  },
  twitter: {
    card: "summary_large_image",
    title: siteSettings.name,
    description: siteSettings.description,
    images: [siteSettings.logo],
    creator: "@shadcn",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteSettings.canonical}/site.webmanifest`,
};

export const whatsappLink = siteSettings.contact.whatsappUrl;
