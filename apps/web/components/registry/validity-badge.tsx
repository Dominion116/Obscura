import type { EnrichedPair } from "@obscura/shared";
import { Badge } from "@/components/ui/badge";

// PRD §7.2 correctness rule: the isValid flag is always surfaced. Revoked
// pairs stay listed (coverage) but are unmistakably flagged; later phases
// also block wrapping into them. Pairs declared in the local custom-pairs
// config carry no registry validity, so they show a distinct Custom badge
// instead of claiming to be registry-valid.
export function ValidityBadge({
  isValid,
  source,
}: {
  isValid: boolean;
  source?: EnrichedPair["source"];
}) {
  if (source === "custom") {
    return (
      <Badge className="border-transparent bg-chart-3/15 text-chart-3 hover:bg-chart-3/15">
        Custom
      </Badge>
    );
  }
  return isValid ? (
    <Badge className="border-transparent bg-chart-2/15 text-chart-2 hover:bg-chart-2/15">
      Valid
    </Badge>
  ) : (
    <Badge className="border-transparent bg-destructive/15 text-destructive hover:bg-destructive/15">
      Revoked
    </Badge>
  );
}
