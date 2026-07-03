import { BlurReveal } from "@/components/shared/blur-reveal";

export function Problem() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <BlurReveal>
        <p className="text-sm font-medium uppercase tracking-widest text-cobalt-400">
          The problem
        </p>
        <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
          Every team that deploys its own test wrappers fragments the
          ecosystem.
        </h2>
        <p className="mt-6 max-w-2xl text-lg font-light text-muted">
          Zama's Confidential Token Wrappers Registry already maps each ERC-20
          to its official ERC-7984 wrapper — one canonical, revocable source of
          truth. But without a product on top of it, developers keep spinning
          up parallel tokens nobody else recognises. Obscura makes the registry
          the obvious place to point to: browsable, trustworthy, and usable by
          anyone.
        </p>
      </BlurReveal>
    </section>
  );
}
