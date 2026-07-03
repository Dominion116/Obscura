import type { Metadata } from "next";
import { PageStub } from "@/components/shared/page-stub";

export const metadata: Metadata = { title: "Developers" };

export default function DevelopersPage() {
  return (
    <PageStub
      title="Developer reference"
      description="How the registry and wrappers fit together, Sepolia addresses, copy-ready snippets for every action, and an install-to-first-wrap guide."
      phase="Phase 6"
    />
  );
}
