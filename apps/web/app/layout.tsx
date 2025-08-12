import type { Metadata } from "next";

import { Providers } from "@/components/providers";
import { constructMetadata } from "@workspace/utils";

import "@workspace/ui/globals.css";
import "../styles/global.css";
import { oldStandardTT } from "@/styles/fonts";

export const metadata: Metadata = constructMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${oldStandardTT.variable} font-sans antialiased `}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
