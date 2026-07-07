import type { EnrichedPair } from "@obscura/shared";
import { Badge } from "@/components/ui/badge";

// PRD §7.2 correctness rule: the isValid flag is always surfaced. Revoked
// pairs stay listed (coverage) but are unmistakably flagged; later phases
// also block wrapping into them. Pairs declared in the local custom-pairs
// config, or added by the visitor through the registry UI, carry no
// registry validity, so they show a distinct badge instead of claiming to
// be registry-valid.
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
  if (source === "local") {
    return (
      <Badge
        title="Added by you in this browser only"
        className="border-transparent bg-chart-4/15 text-chart-4 hover:bg-chart-4/15"
      >
        Local
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
