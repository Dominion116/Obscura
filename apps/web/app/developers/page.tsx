import { redirect } from "next/navigation";
import { env } from "@/config/env";

// The developer reference lives on the standalone docs site (apps/docs).
// This route survives only so old /developers links keep working.
export default function DevelopersPage() {
  redirect(env.docsUrl);
}
