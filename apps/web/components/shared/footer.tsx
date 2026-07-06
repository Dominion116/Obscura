"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  WRAPPERS_REGISTRY_ADDRESS,
  explorerAddressUrl,
} from "@obscura/shared";
import { shortAddress } from "@/lib/utils";
import { env } from "@/config/env";

const productLinks = [
  { href: "/registry", label: "Registry" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/faucet", label: "Faucet" },
  { href: "/activity", label: "Activity" },
];

const legalLinks = [
  { href: "/terms", label: "Terms of Service" },
  { href: "/privacy", label: "Privacy Policy" },
];

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="border-t border-border"
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 sm:grid-cols-2 md:grid-cols-5">
        <div className="sm:col-span-2">
          <p className="text-lg font-semibold tracking-tight">
            obscura<span className="text-primary">.</span>
          </p>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            The confidential wrapper registry, made usable. An open-source
            reference implementation for the Zama Confidential Token
            Wrappers Registry on Sepolia.
          </p>
        </div>

        <nav aria-label="Product">
          <p className="text-sm font-semibold">Product</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {productLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="transition-colors hover:text-foreground"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Resources">
          <p className="text-sm font-semibold">Resources</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <a
                href={env.docsUrl}
                className="transition-colors hover:text-foreground"
              >
                Developer docs
              </a>
            </li>
            <li>
              <a
                href="https://github.com/Dominion116"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-foreground"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href="https://docs.zama.org/protocol"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-foreground"
              >
                Zama Protocol docs
              </a>
            </li>
            <li>
              <a
                href={explorerAddressUrl(WRAPPERS_REGISTRY_ADDRESS)}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-xs transition-colors hover:text-foreground"
                title="Wrappers Registry on Sepolia Etherscan"
              >
                Registry {shortAddress(WRAPPERS_REGISTRY_ADDRESS)}
              </a>
            </li>
          </ul>
        </nav>

        <nav aria-label="Legal">
          <p className="text-sm font-semibold">Legal</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {legalLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="transition-colors hover:text-foreground"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </motion.footer>
  );
}
