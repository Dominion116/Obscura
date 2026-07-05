import type { Metadata } from "next";
import { ActivityFeed } from "@/components/activity/activity-feed";

export const metadata: Metadata = {
  title: "Activity",
  description:
    "A live stream of wraps, unwraps, registrations, and revocations across the whole registry, using only public data.",
};

export default function ActivityPage() {
  return <ActivityFeed />;
}
