"use client";

// Transaction tracker shell. Phase 0 ships the chrome; Phase 3 feeds it
// in-flight transactions and pending unwrap requests, which is why the
// tracker is a permanent part of the navigation rather than a toast.

import { useState } from "react";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export function TxTracker() {
  const [open, setOpen] = useState(false);
  const pendingCount = 0; // wired to the unwrap state machine in Phase 3

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Transaction tracker"
        className={cn(
          "relative inline-flex items-center justify-center rounded-(--radius-btn) p-2 transition-colors",
          "glass text-muted hover:text-foreground",
        )}
      >
        <Activity className="size-4" aria-hidden />
        {pendingCount > 0 && (
          <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-cobalt-500 text-[10px] font-semibold text-white">
            {pendingCount}
          </span>
        )}
      </button>

      {open && (
        <div className="glass-strong absolute right-0 top-full z-50 mt-2 w-72 rounded-(--radius-card) p-4">
          <p className="text-sm font-medium">Transactions</p>
          <p className="mt-2 text-xs text-muted">
            No pending transactions. In-flight wraps and asynchronous unwrap
            requests will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
