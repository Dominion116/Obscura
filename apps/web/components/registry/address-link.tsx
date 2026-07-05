import { ExternalLink } from "lucide-react";
import { explorerAddressUrl, type Address } from "@obscura/shared";
import { shortAddress } from "@/lib/format";

/** Truncated address that links out to the block explorer for verification. */
export function AddressLink({ address }: { address: Address }) {
  return (
    <a
      href={explorerAddressUrl(address)}
      target="_blank"
      rel="noopener noreferrer"
      title={address}
      className="inline-flex items-center gap-1 rounded font-mono text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {shortAddress(address)}
      <ExternalLink className="size-3 shrink-0" aria-hidden />
      <span className="sr-only">View {address} on Etherscan</span>
    </a>
  );
}
