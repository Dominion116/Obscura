"use client";

// Transaction tracker shell. Phase 0 ships the chrome; Phase 3 feeds it
// in-flight transactions and pending unwrap requests, which is why the
// tracker is a permanent part of the navigation rather than a toast.

import { useState } from "react";
import { Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TxTracker() {
  const [open, setOpen] = useState(false);
  const pendingCount = 0; // wired to the unwrap state machine in Phase 3

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label="Transaction tracker"
        className="relative"
      >
        <Activity className="size-4" aria-hidden />
        {pendingCount > 0 && (
          <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
            {pendingCount}
          </span>
        )}
      </Button>

      {open && (
        <div
          role="dialog"
          aria-label="Transactions"
          className="absolute right-0 top-full z-50 mt-2 w-72 rounded-xl border border-border bg-popover p-4 text-popover-foreground shadow-lg"
        >
          <p className="text-sm font-medium">Transactions</p>
          <p className="mt-2 text-xs text-muted-foreground">
            No pending transactions. In-flight wraps and asynchronous unwrap
            requests will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
