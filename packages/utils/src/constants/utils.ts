import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { siteSettings } from "./site-settings";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const lastUpdated = new Date(
  siteSettings.lastUpdated,
).toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});
