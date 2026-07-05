import type { Metadata } from "next";
import { RegistryExplorer } from "@/components/registry/registry-explorer";

export const metadata: Metadata = {
  title: "Registry",
  description:
    "Every ERC-20 to ERC-7984 wrapper pair on Sepolia with validity status, search, conversion rate, decimals, and Total Value Shielded.",
};

export default function RegistryPage() {
  return <RegistryExplorer />;
}
