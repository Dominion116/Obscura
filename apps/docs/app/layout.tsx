import type { Metadata } from "next";
import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import "nextra-theme-docs/style.css";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const REPO_URL = "https://github.com/Dominion116/Obscura";

export const metadata: Metadata = {
  title: {
    default: "Obscura Docs — Confidential Wrapper Registry",
    template: "%s · Obscura Docs",
  },
  description:
    "Developer reference for the Zama Confidential Token Wrappers Registry on Sepolia: read the registry, wrap, run the two-step unwrap, decrypt balances, and transfer confidentially.",
};

const navbar = (
  <Navbar
    logo={
      <span style={{ fontWeight: 600, letterSpacing: "-0.02em" }}>
        obscura<span style={{ color: "hsl(224 100% 58%)" }}>.</span>
        <span style={{ fontWeight: 400, opacity: 0.7 }}> docs</span>
      </span>
    }
    projectLink={REPO_URL}
  >
    <a href={APP_URL} style={{ fontSize: "0.875rem", whiteSpace: "nowrap" }}>
      Open the app ↗
    </a>
  </Navbar>
);

const footer = (
  <Footer>
    Obscura — built for the Zama Developer Program, Mainnet Season 3 bounty
    track. Sepolia testnet only.
  </Footer>
);

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head color={{ hue: 224, saturation: 100 }} />
      <body>
        <Layout
          navbar={navbar}
          footer={footer}
          pageMap={await getPageMap()}
          docsRepositoryBase={`${REPO_URL}/tree/main/apps/docs`}
          editLink="Edit this page on GitHub"
          feedback={{ content: "Questions? Open an issue" }}
          sidebar={{ defaultMenuCollapseLevel: 2 }}
          nextThemes={{ defaultTheme: "dark" }}
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
