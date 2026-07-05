import { Badge } from "@/components/ui/badge";

// PRD §7.2 correctness rule: the isValid flag is always surfaced. Revoked
// pairs stay listed (coverage) but are unmistakably flagged; later phases
// also block wrapping into them.
export function ValidityBadge({ isValid }: { isValid: boolean }) {
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
