import { Geist, Geist_Mono } from "next/font/google";

import { Old_Standard_TT } from "next/font/google";
// import localFont from "next/font/local";

export const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

// export const satoshi = localFont({
//   src: "../styles/Satoshi-Variable.woff2",
//   variable: "--font-satoshi",
//   weight: "300 900",
//   display: "swap",
//   style: "normal",
// });

export const oldStandardTT = Old_Standard_TT({
  weight: ["400", "700"], // available weights: 400 (normal), 700 (bold)
  subsets: ["latin"],
  variable: "--font-old-standard",
  display: "swap",
});

// export const inter = Inter({
//   variable: "--font-inter",
//   subsets: ["latin"],
// });

// export const geistMono = GeistMono;
