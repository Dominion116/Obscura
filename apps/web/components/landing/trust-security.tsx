import { Eye, Globe, ShieldAlert } from "lucide-react";
import { BlurReveal } from "@/components/shared/blur-reveal";

const items = [
  {
    icon: Eye,
    title: "User decryption",
    body: "Reading your own balance never exposes it. You sign a typed-data request and the value is decrypted in your browser, visible only to you.",
  },
  {
    icon: Globe,
    title: "Public decryption",
    body: "Used only where the protocol requires a value to become public — the unwrap amount during finalization. Nothing else is ever revealed.",
  },
  {
    icon: ShieldAlert,
    title: "Revoked wrappers are flagged",
    body: "The registry can revoke a wrapper. Obscura checks the isValid flag on every read and blocks wrapping into anything revoked.",
  },
];

export function TrustSecurity() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <BlurReveal>
        <p className="text-sm font-medium uppercase tracking-widest text-cobalt-400">
          Trust and security
        </p>
        <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
          Two decryption paths, kept deliberately distinct.
        </h2>
      </BlurReveal>
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {items.map((item, i) => (
          <BlurReveal key={item.title} delay={i * 0.1}>
            <div className="glass h-full rounded-(--radius-card) p-6">
              <div className="flex size-10 items-center justify-center rounded-full bg-cobalt-500/15 text-cobalt-300">
                <item.icon className="size-5" aria-hidden />
              </div>
              <h3 className="mt-4 font-medium">{item.title}</h3>
              <p className="mt-2 text-sm font-light text-muted">{item.body}</p>
            </div>
          </BlurReveal>
        ))}
      </div>
    </section>
  );
}
