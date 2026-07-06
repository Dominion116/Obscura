import { Eye, Globe, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
    body: "Used only where the protocol requires a value to become public: the unwrap amount during finalization. Nothing else is ever revealed.",
  },
  {
    icon: ShieldAlert,
    title: "Revoked wrappers are flagged",
    body: "The registry can revoke a wrapper. Obscura checks the isValid flag on every read and blocks wrapping into anything revoked.",
  },
];

export function TrustSecurity() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 md:py-32">
      <BlurReveal>
        <Badge variant="secondary">Trust and security</Badge>
        <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-pretty md:text-4xl lg:text-5xl">
          Two decryption paths, kept deliberately distinct.
        </h2>
      </BlurReveal>
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {items.map((item, i) => (
          <BlurReveal key={item.title} delay={i * 0.1}>
            <div className="group h-full rounded-xl border border-border bg-card p-6 transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-primary/40">
              <span className="flex size-10 items-center justify-center rounded-full bg-accent text-accent-foreground transition-transform duration-300 group-hover:scale-110">
                <item.icon className="size-5" aria-hidden />
              </span>
              <h3 className="mt-4 font-medium tracking-tight">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
            </div>
          </BlurReveal>
        ))}
      </div>
    </section>
  );
}
