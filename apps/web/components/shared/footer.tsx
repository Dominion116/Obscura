import Link from "next/link";
import {
  WRAPPERS_REGISTRY_ADDRESS,
  explorerAddressUrl,
} from "@obscura/shared";
import { shortAddress } from "@/lib/utils";

const productLinks = [
  { href: "/registry", label: "Registry" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/faucet", label: "Faucet" },
  { href: "/activity", label: "Activity" },
  { href: "/developers", label: "Developers" },
];

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="text-lg font-semibold tracking-tight">
            obscura<span className="text-primary">.</span>
          </p>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            The confidential wrapper registry, made usable. Built for the Zama
            Developer Program, Mainnet Season 3 bounty track.
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
      </div>
    </footer>
  );
}
