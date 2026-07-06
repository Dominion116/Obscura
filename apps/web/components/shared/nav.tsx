"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { NetworkBadge } from "./network-badge";
import { TxTracker } from "./tx-tracker";
import { WalletButton } from "./wallet-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { env } from "@/config/env";

// Developers points at the standalone docs site (apps/docs), so it renders
// as a plain anchor; the rest are in-app routes.
const links = [
  { href: "/registry", label: "Registry" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/faucet", label: "Faucet" },
  { href: "/activity", label: "Activity" },
  { href: env.docsUrl, label: "Developers", external: true },
];

export function Nav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="sticky top-0 z-40"
    >
      <div className="border-b border-border bg-background/80 backdrop-blur-xl">
        <nav
          aria-label="Main"
          className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6"
        >
          <div className="flex items-center gap-8">
            <Link href="/" className="text-lg font-semibold tracking-tight">
              obscura<span className="text-primary">.</span>
            </Link>
            <ul className="hidden items-center gap-1 md:flex">
              {links.map((link) => {
                const className = cn(
                  "rounded-md px-3 py-2 text-sm transition-colors",
                  !link.external && pathname?.startsWith(link.href)
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                );
                return (
                  <li key={link.href}>
                    {link.external ? (
                      <a href={link.href} className={className}>
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        aria-current={
                          pathname?.startsWith(link.href) ? "page" : undefined
                        }
                        className={className}
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex">
              <NetworkBadge />
            </span>
            <TxTracker />
            <span className="hidden sm:inline-flex">
              <WalletButton />
            </span>
            <Button
              variant="outline"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="size-4" aria-hidden />
              ) : (
                <Menu className="size-4" aria-hidden />
              )}
            </Button>
          </div>
        </nav>

        <AnimatePresence initial={false}>
          {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, y: -8 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -8 }}
            transition={{ duration: 0.24, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="overflow-hidden border-t border-border px-6 pb-4 md:hidden"
          >
            <ul className="flex flex-col gap-1 pt-3">
              {links.map((link) => {
                const className = cn(
                  "block rounded-md px-3 py-2 text-sm",
                  !link.external && pathname?.startsWith(link.href)
                    ? "text-foreground"
                    : "text-muted-foreground",
                );
                return (
                  <li key={link.href}>
                    {link.external ? (
                      <a
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={className}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        aria-current={
                          pathname?.startsWith(link.href) ? "page" : undefined
                        }
                        className={className}
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
            <div className="mt-3 flex items-center gap-3">
              <NetworkBadge />
              <WalletButton />
            </div>
          </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
