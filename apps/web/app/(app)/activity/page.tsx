import type { Metadata } from "next";
import { PageStub } from "@/components/shared/page-stub";

export const metadata: Metadata = { title: "Activity" };

export default function ActivityPage() {
  return (
    <PageStub
      title="Activity"
      description="A live stream of wraps, unwraps, registrations, and revocations across the whole registry, using only public data."
      phase="Phase 5"
    />
  );
}
