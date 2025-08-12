import { InstagramIcon } from "lucide-react";
import {
  Book2Fill,
  ConnectedDotsFill,
  CubeSettingsFill,
  FeatherFill,
  HeadsetFill,
  HeartFill,
  HexadecagonStar,
  Instagram,
  LinkedIn,
  WhatsApp,
  YouTube,
} from "../icons";
import { siteSettings, whatsappLink } from "./site-settings";

export const NAVLINKS = [
  {
    title: "Master of Business Administration (MBA)",
    description: "We turns your story into an admit-ready MBA application",
    href: "/admissions-consulting/master-of-business-administration",
  },
  {
    title: "Master of Finance / Financial Engineering",
    description:
      "Get coaching for finance-heavy applications— specialized essays to intensive interviews",
    href: "/admissions-consulting/master-in-finance",
  },
  {
    title: "Master in Management (MiM)",
    description:
      "Break into LBS, HEC, INSEAD, and beyond— no full-time work experience required",
    href: "/admissions-consulting/master-in-management",
  },
  {
    title: "Master in Marketing",
    description:
      "Break into Columbia, NYU, ESADE, ESSEC, and beyond— on the strength of your ideas",
    href: "/admissions-consulting/master-in-marketing",
  },
  {
    title: "Undergraduate / Bachelors abroad",
    description:
      "Earn offers from Ivy League, Oxbridge, and leading universities— straight from high school.",
    href: "/admissions-consulting/undergraduate-bachelors-abroad",
  },
  {
    title: "Specialised Masters (Data science, etc.)",
    description:
      "From Data Science to Luxury & Sustainability— stand out in any niche with limited experience",
    href: "/admissions-consulting/specialised-masters",
  },
];

export const COMPANY = [
  {
    title: `About ${siteSettings.siteName}`,
    description: "Company and team",
    href: "/about",
  },
  {
    title: "Resources",
    description: "Insights and updates",
    href: "/resources",
  },
  {
    title: "Join the Team",
    description: "Consultants, and other roles",
    href: "/careers",
    // href: "https://www.linkedin.com/company/gradbrew/",
  },
  {
    title: "Contact Us",
    description: "Queries and calls",
    href: "/lets-talk",
  },
];

export const COMPARE_PAGES = [
  { name: "Bitly", slug: "bitly" },
  { name: "Rebrandly", slug: "rebrandly" },
  { name: "Short.io", slug: "short" },
  { name: "Bl.ink", slug: "blink" },
];

export const LEGAL_PAGES = [
  { name: "Privacy", slug: "privacy" },
  { name: "Terms", slug: "terms" },
  { name: "DPA", slug: "dpa" },
  { name: "Subprocessors", slug: "subprocessors" },
  { name: "Report Abuse", slug: "abuse" },
];

export const SOCIAL_LINKS = [
  {
    name: "Whatsapp",
    icon: WhatsApp,
    href: whatsappLink,
  },
  {
    name: siteSettings.social.LinkedIn.label,
    icon: LinkedIn,
    href: siteSettings.social.LinkedIn.url,
  },
  {
    name: siteSettings.social.instagram.label,
    icon: Instagram,
    href: siteSettings.social.instagram.url,
  },
  {
    name: siteSettings.social.youtube.label,
    icon: YouTube,
    href: siteSettings.social.youtube.url,
  },
];

export const ALL_TOOLS = [
  { name: "Spotify Link Shortener", slug: "spotify-link-shortener" },
  { name: "ChatGPT Link Shortener", slug: "chatgpt-link-shortener" },
  { name: "GitHub Link Shortener", slug: "github-link-shortener" },
  { name: "Calendar Link Shortener", slug: "cal-link-shortener" },
  { name: "Google Link Shortener", slug: "google-link-shortener" },
  { name: "Amazon Link Shortener", slug: "amazon-link-shortener" },
  { name: "Figma Link Shortener", slug: "figma-link-shortener" },
  { name: "Metatags API", slug: "metatags" },
  { name: "Link Inspector", slug: "inspector" },
  { name: "QR Code API", slug: "qr-code" },
  { name: "UTM Builder", slug: "utm-builder" },
];

export const maxWidthWrapperClassName = "lg:px-4 xl:px-0";
