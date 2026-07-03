"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NetworkBadge } from "./network-badge";
import { TxTracker } from "./tx-tracker";
import { WalletButton } from "./wallet-button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/registry", label: "Registry" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/faucet", label: "Faucet" },
  { href: "/activity", label: "Activity" },
  { href: "/developers", label: "Developers" },
];

export function Nav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40">
      <div className="glass-strong border-x-0 border-t-0">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-lg font-semibold tracking-tight">
              obscura<span className="text-cobalt-400">.</span>
            </Link>
            <ul className="hidden items-center gap-1 md:flex">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "rounded-(--radius-btn) px-3 py-2 text-sm transition-colors",
                      pathname?.startsWith(link.href)
                        ? "text-foreground"
                        : "text-muted hover:text-foreground",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
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
            <button
              type="button"
              className="glass inline-flex items-center justify-center rounded-(--radius-btn) p-2 text-muted hover:text-foreground md:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </nav>

        {mobileOpen && (
          <div className="border-t border-line px-4 pb-4 md:hidden">
            <ul className="flex flex-col gap-1 pt-3">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "block rounded-(--radius-btn) px-3 py-2 text-sm",
                      pathname?.startsWith(link.href)
                        ? "text-foreground"
                        : "text-muted",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-center gap-3">
              <NetworkBadge />
              <WalletButton />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
