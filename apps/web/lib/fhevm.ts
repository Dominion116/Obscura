"use client";

// Thin client-side wrapper around the Zama Relayer SDK. All FHE operations
// (input encryption, user decryption, public decryption) go through the
// instance returned by getFhevmInstance so the SDK loads exactly once.
//
// The SDK ships WASM and must only ever load in the browser, so every import
// is dynamic and every caller is a client component.

import type { FhevmInstance } from "@zama-fhe/relayer-sdk/web";
import { env } from "@/config/env";

let instancePromise: Promise<FhevmInstance> | null = null;

export function getFhevmInstance(): Promise<FhevmInstance> {
  if (typeof window === "undefined") {
    return Promise.reject(
      new Error("The FHEVM client is browser-only; call it from a client component."),
    );
  }
  if (!instancePromise) {
    instancePromise = (async () => {
      const { initSDK, createInstance, SepoliaConfig } = await import(
        "@zama-fhe/relayer-sdk/web"
      );
      await initSDK();
      return createInstance({
        ...SepoliaConfig,
        // Always use the app's dedicated RPC, same as every other read in
        // the app (lib/viem.ts publicClient). The SDK uses this only for its
        // own ACL/InputVerifier reads, never for signing, so routing it
        // through the connected wallet's provider gained nothing and made
        // those reads dependent on the wallet's own (often public,
        // rate-limited) RPC and chain state instead of our known-good one.
        network: env.sepoliaRpcUrl,
      });
    })().catch((error) => {
      // Allow a retry on the next call instead of caching the failure.
      instancePromise = null;
      throw error;
    });
  }
  return instancePromise;
}
