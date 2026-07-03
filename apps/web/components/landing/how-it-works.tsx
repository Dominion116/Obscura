import { Search, Lock, Send, Unlock } from "lucide-react";
import { BlurReveal } from "@/components/shared/blur-reveal";

const steps = [
  {
    icon: Search,
    title: "Discover a pair",
    body: "Find any ERC-20 and its official confidential wrapper in the registry, with validity always visible.",
  },
  {
    icon: Lock,
    title: "Wrap",
    body: "Approve and wrap in two clear steps. The exact rounded amount and any refund are previewed before you sign.",
  },
  {
    icon: Send,
    title: "Hold or transfer privately",
    body: "Your balance is encrypted on chain. Transfer with the amount hidden — only you can decrypt what you hold.",
  },
  {
    icon: Unlock,
    title: "Unwrap",
    body: "A guided two-step flow requests the unwrap, decrypts the amount, and releases your underlying tokens.",
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <BlurReveal>
        <p className="text-sm font-medium uppercase tracking-widest text-cobalt-400">
          How it works
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          Private value in four steps.
        </h2>
      </BlurReveal>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <BlurReveal key={step.title} delay={i * 0.1}>
            <div className="glass h-full rounded-(--radius-card) p-6">
              <div className="flex size-10 items-center justify-center rounded-full bg-cobalt-500/15 text-cobalt-300">
                <step.icon className="size-5" aria-hidden />
              </div>
              <p className="mt-4 text-sm font-medium text-cobalt-400">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-1 font-medium">{step.title}</h3>
              <p className="mt-2 text-sm font-light text-muted">{step.body}</p>
            </div>
          </BlurReveal>
        ))}
      </div>
    </section>
  );
}
