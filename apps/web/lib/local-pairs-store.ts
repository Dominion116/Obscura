"use client";

// Browser-local pair declarations: a visitor can add a pair from the
// registry UI without touching code or redeploying. Stored per-browser only
// (same localStorage pattern as unwrap-store.ts), so these are never shared
// with other visitors; the code-configured CUSTOM_PAIRS list is still the
// place for pairs that should ship with the app.

import { useSyncExternalStore } from "react";
import type { Address } from "@obscura/shared";

export interface LocalPairRecord {
  tokenAddress: Address;
  confidentialTokenAddress: Address;
  addedAt: number;
}

const STORAGE_KEY = "obscura.local-pairs.v1";

let cache: LocalPairRecord[] | null = null;
const listeners = new Set<() => void>();
const EMPTY: LocalPairRecord[] = [];

function load(): LocalPairRecord[] {
  if (typeof window === "undefined") return EMPTY;
  if (cache === null) {
    try {
      cache = JSON.parse(
        window.localStorage.getItem(STORAGE_KEY) ?? "[]",
      ) as LocalPairRecord[];
    } catch {
      cache = [];
    }
  }
  return cache;
}

function save(next: LocalPairRecord[]): void {
  cache = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Quota/private-mode failures degrade to in-memory state.
  }
  listeners.forEach((listener) => listener());
}

export function listLocalPairs(): LocalPairRecord[] {
  return load();
}

/** No-op if the wrapper address is already present. */
export function addLocalPair(record: LocalPairRecord): void {
  const key = record.confidentialTokenAddress.toLowerCase();
  const existing = load();
  if (existing.some((p) => p.confidentialTokenAddress.toLowerCase() === key)) {
    return;
  }
  save([record, ...existing]);
}

export function removeLocalPair(confidentialTokenAddress: Address): void {
  const key = confidentialTokenAddress.toLowerCase();
  save(load().filter((p) => p.confidentialTokenAddress.toLowerCase() !== key));
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

/** All locally-added pairs, newest first, live across tabs. */
export function useLocalPairs(): LocalPairRecord[] {
  return useSyncExternalStore(subscribe, load, () => EMPTY);
}
