"use client";

// macOS-style code window for the landing page: traffic-light dots, a copy
// button, and lightweight syntax coloring. The snippet is static marketing
// copy, so a tiny regex tokenizer keeps the landing page free of a full
// syntax-highlighting dependency.

import { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";

// Alternation order is priority: comments swallow anything after //, strings
// swallow anything quoted, so later patterns never fire inside them.
const CODE_TOKEN = new RegExp(
  [
    String.raw`(?<comment>\/\/.*)`,
    String.raw`(?<string>"(?:[^"\\\n]|\\.)*")`,
    String.raw`(?<keyword>\b(?:import|from|const|await|async|function|return)\b)`,
    String.raw`(?<constant>\b[A-Z][A-Z0-9_]{2,}\b)`,
    String.raw`(?<fn>\b[a-zA-Z_$][\w$]*(?=\())`,
    String.raw`(?<prop>\b[a-zA-Z_$][\w$]*(?=:))`,
  ].join("|"),
  "g",
);

const TOKEN_CLASS: Record<string, string> = {
  comment: "text-emerald-400/60 italic",
  string: "text-sky-300",
  keyword: "text-rose-400",
  constant: "text-amber-300",
  fn: "text-violet-300",
  prop: "text-cyan-300",
};

function highlight(code: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let last = 0;
  for (const match of code.matchAll(CODE_TOKEN)) {
    const index = match.index ?? 0;
    if (index > last) nodes.push(code.slice(last, index));
    const [type, text] = Object.entries(match.groups ?? {}).find(
      ([, value]) => value !== undefined,
    ) ?? ["", match[0]];
    nodes.push(
      <span key={`${index}-${type}`} className={TOKEN_CLASS[type]}>
        {text}
      </span>,
    );
    last = index + match[0].length;
  }
  if (last < code.length) nodes.push(code.slice(last));
  return nodes;
}

export function CodeWindow({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const highlighted = useMemo(() => highlight(code), [code]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access denied (permissions or non-secure context): leave
      // the button as-is rather than claiming a copy that didn't happen.
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-lg">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-2" aria-hidden>
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
        </div>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "Copied" : "Copy code"}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {copied ? (
            <>
              <Check className="size-3.5 text-emerald-400" aria-hidden />
              Copied
            </>
          ) : (
            <>
              <Copy className="size-3.5" aria-hidden />
              Copy
            </>
          )}
        </button>
      </div>
      {/* pre-wrap: long lines continue on the next line instead of widening
          the grid column past the viewport */}
      <pre className="whitespace-pre-wrap break-words p-6 font-mono text-xs leading-relaxed text-foreground/90">
        <code>{highlighted}</code>
      </pre>
    </div>
  );
}
