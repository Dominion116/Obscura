import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { Providers } from "@/providers";
import "./globals.css";

// Open Sans is the theme's sans font, loaded via next/font. Georgia and
// Menlo (the theme's serif/mono) are system fonts, not Google Fonts, so
// they resolve straight from the CSS font stacks in globals.css.
const fontSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "Obscura — Confidential Wrapper Registry",
    template: "%s · Obscura",
  },
  description:
    "Browse every ERC-20 to ERC-7984 wrapper pair on Sepolia, wrap and unwrap tokens, and decrypt confidential balances. Built on the Zama Confidential Token Wrappers Registry.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`dark ${fontSans.variable}`}>
      <body className="min-h-dvh font-sans antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
        >
          Skip to content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
