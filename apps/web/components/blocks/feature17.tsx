import { Lock, Search, Send, Unlock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

interface FeatureIconListItem {
  title: string;
  description: string;
  icon?: React.ReactNode;
  href?: string;
}
// Named FeatureButton rather than the template's `Button`: that identifier
// is already taken by the imported shadcn Button component.
interface FeatureButton {
  text: string;
  url: string;
  icon?: React.ReactNode;
}
interface Buttons {
  primary?: FeatureButton;
  secondary?: FeatureButton;
}

interface FeatureIconListProps {
  heading: string;
  label?: string;
  features?: FeatureIconListItem[];
  buttons?: Buttons;
  className?: string;
}

interface Feature17Props extends FeatureIconListProps {}
type Props = Partial<Feature17Props>;

const defaultProps: Feature17Props = {
  heading: "Private value in four steps",
  label: "How it works",
  features: [
    {
      icon: <Search className="size-5" />,
      title: "Discover a pair",
      description:
        "Find any ERC-20 and its official confidential wrapper in the registry, with validity always visible.",
    },
    {
      icon: <Lock className="size-5" />,
      title: "Wrap",
      description:
        "Approve and wrap in two clear steps. The exact rounded amount and any refund are previewed before you sign.",
    },
    {
      icon: <Send className="size-5" />,
      title: "Hold or transfer privately",
      description:
        "Your balance is encrypted on chain. Transfer with the amount hidden — only you can decrypt what you hold.",
    },
    {
      icon: <Unlock className="size-5" />,
      title: "Unwrap",
      description:
        "A guided two-step flow requests the unwrap, decrypts the amount, and releases your underlying tokens.",
    },
  ],
  buttons: {
    primary: {
      text: "Explore the registry",
      url: "/registry",
    },
  },
};

const MAX_FEATURES = 4;

const Feature17 = (props: Props) => {
  const { heading, label, features, buttons, className } = {
    ...defaultProps,
    ...props,
  };
  const items = (features ?? []).slice(0, MAX_FEATURES);

  return (
    <section className={cn("py-32", className)}>
      {/* Tailwind v4's `container` neither centers nor pads by itself */}
      <div className="container mx-auto px-6">
        {(label || heading) && (
          <div className="mx-auto mb-12 flex max-w-3xl flex-col items-center gap-4 text-center">
            {label && <Badge variant="secondary">{label}</Badge>}
            <h2 className="text-3xl font-semibold tracking-tight text-pretty md:text-4xl lg:text-5xl">
              {heading}
            </h2>
          </div>
        )}
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2">
          {items.map((feature, idx) => (
            <div
              key={idx}
              className="flex gap-6 rounded-lg md:block md:space-y-4"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent md:size-12">
                {feature.icon}
              </span>
              <div>
                <h3 className="font-medium tracking-tight md:mb-2 md:text-xl">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground md:text-base">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        {buttons?.primary?.url && (
          <div className="mt-16 flex justify-center">
            <Button size="lg" asChild>
              <a href={buttons.primary.url}>{buttons.primary.text}</a>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export { Feature17 };
