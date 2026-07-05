import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BlurReveal } from "@/components/shared/blur-reveal";

const snippet = `import { registryAbi, WRAPPERS_REGISTRY_ADDRESS } from "@obscura/shared";

// Every registered pair, straight from the source of truth
const pairs = await client.readContract({
  address: WRAPPERS_REGISTRY_ADDRESS,
  abi: registryAbi,
  functionName: "getTokenConfidentialTokenPairs",
});

pairs.forEach(({ tokenAddress, confidentialTokenAddress, isValid }) => {
  // always honour isValid — revoked wrappers must not be used
});`;

export function DevTeaser() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 md:py-32">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <BlurReveal>
          <Badge variant="secondary">For developers</Badge>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-pretty md:text-4xl lg:text-5xl">
            From zero to a working integration in minutes.
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            Obscura is a reference implementation you can read and lift. Every
            hook the app uses — reading pairs, wrapping, the two-step unwrap,
            decryption — is documented with copy-ready snippets.
          </p>
          <Link
            href="/developers"
            className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Open the developer reference
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </BlurReveal>
        <BlurReveal delay={0.15} className="min-w-0">
          {/* pre-wrap: long lines continue on the next line instead of
              widening the grid column past the viewport */}
          <pre className="whitespace-pre-wrap break-words rounded-xl border border-border bg-card p-6 font-mono text-xs leading-relaxed text-muted-foreground">
            <code>{snippet}</code>
          </pre>
        </BlurReveal>
      </div>
    </section>
  );
}
