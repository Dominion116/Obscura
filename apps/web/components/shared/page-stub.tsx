// Temporary placeholder used while a page's phase is pending. Each stub
// disappears as its phase lands (see implementation.md).

import { Badge } from "@/components/ui/badge";

export function PageStub({
  title,
  description,
  phase,
}: {
  title: string;
  description: string;
  phase: string;
}) {
  return (
    <div className="mx-auto mt-16 max-w-xl rounded-xl border border-border bg-card p-8 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-3 text-sm text-muted-foreground">{description}</p>
      <Badge variant="secondary" className="mt-6">
        Arriving in {phase}
      </Badge>
    </div>
  );
}
