import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <BlurReveal>
          <p className="text-sm font-medium uppercase tracking-widest text-cobalt-400">
            For developers
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            From zero to a working integration in minutes.
          </h2>
          <p className="mt-6 text-lg font-light text-muted">
            Obscura is a reference implementation you can read and lift. Every
            hook the app uses — reading pairs, wrapping, the two-step unwrap,
            decryption — is documented with copy-ready snippets.
          </p>
          <Link
            href="/developers"
            className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-cobalt-300 hover:text-cobalt-200"
          >
            Open the developer reference
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </BlurReveal>
        <BlurReveal delay={0.15}>
          <pre className="glass overflow-x-auto rounded-(--radius-card) p-6 font-mono text-xs leading-relaxed text-muted">
            <code>{snippet}</code>
          </pre>
        </BlurReveal>
      </div>
    </section>
  );
}
