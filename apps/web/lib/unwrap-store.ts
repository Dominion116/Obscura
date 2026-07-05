"use client";

// Persistent home for unwrap requests (PRD §7.3): the two-step flow keeps
// running state in localStorage so a user can close the tab mid-flow and
// resume from the tracker or the drawer later. Only public data is stored;
// the cleartext amount is already public once the unwrap decrypts.

import { useSyncExternalStore } from "react";
import type { UnwrapRequest } from "@obscura/shared";

const STORAGE_KEY = "obscura.unwraps.v1";
/** Oldest finished records are dropped past this cap. */
const MAX_RECORDS = 50;

let cache: UnwrapRequest[] | null = null;
const listeners = new Set<() => void>();
const EMPTY: UnwrapRequest[] = [];

function load(): UnwrapRequest[] {
  if (typeof window === "undefined") return EMPTY;
  if (cache === null) {
    try {
      cache = JSON.parse(
        window.localStorage.getItem(STORAGE_KEY) ?? "[]",
      ) as UnwrapRequest[];
    } catch {
      cache = [];
    }
  }
  return cache;
}

function save(next: UnwrapRequest[]): void {
  cache = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Quota/private-mode failures degrade to in-memory state.
  }
  listeners.forEach((listener) => listener());
}

export function listUnwraps(): UnwrapRequest[] {
  return load();
}

export function upsertUnwrap(record: UnwrapRequest): void {
  const rest = load().filter((r) => r.key !== record.key);
  const next = [record, ...rest].sort((a, b) => b.createdAt - a.createdAt);
  // Never evict records that still need action to release funds.
  const finished = next.filter((r) => r.status === "finalized");
  const active = next.filter((r) => r.status !== "finalized");
  save([...active, ...finished].slice(0, Math.max(MAX_RECORDS, active.length)));
}

export function patchUnwrap(
  key: string,
  patch: Partial<UnwrapRequest>,
): UnwrapRequest | undefined {
  const records = load();
  const existing = records.find((r) => r.key === key);
  if (!existing) return undefined;
  const updated = { ...existing, ...patch, updatedAt: Date.now() };
  save(records.map((r) => (r.key === key ? updated : r)));
  return updated;
}

export function removeUnwrap(key: string): void {
  save(load().filter((r) => r.key !== key));
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  // Keep multiple tabs consistent: another tab writing invalidates our cache.
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cache = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** All stored unwrap requests, newest first, live across tabs. */
export function useUnwrapRequests(): UnwrapRequest[] {
  return useSyncExternalStore(subscribe, load, () => EMPTY);
}
