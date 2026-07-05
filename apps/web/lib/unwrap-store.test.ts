import { beforeEach, describe, expect, it } from "vitest";
import type { UnwrapRequest } from "@obscura/shared";
import { listUnwraps, patchUnwrap, removeUnwrap, upsertUnwrap } from "./unwrap-store";

const ACCOUNT = "0x1111111111111111111111111111111111111111" as const;
const WRAPPER = "0x2222222222222222222222222222222222222222" as const;

function makeRecord(overrides: Partial<UnwrapRequest> = {}): UnwrapRequest {
  return {
    key: "0xkey1",
    account: ACCOUNT,
    wrapper: WRAPPER,
    wrapperSymbol: "cUSDC",
    wrapperDecimals: 6,
    tokenSymbol: "USDC",
    tokenDecimals: 18,
    rate: (10n ** 12n).toString(),
    receiver: ACCOUNT,
    status: "requesting",
    requestTxHash: "0xkey1",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...overrides,
  };
}

beforeEach(() => {
  // The module caches state in a module-level variable, so clearing
  // localStorage alone wouldn't reset it between tests in this file.
  for (const record of listUnwraps()) removeUnwrap(record.key);
});

describe("upsertUnwrap / listUnwraps", () => {
  it("stores a new record and lists it back", () => {
    upsertUnwrap(makeRecord());
    const all = listUnwraps();
    expect(all).toHaveLength(1);
    expect(all[0]!.key).toBe("0xkey1");
  });

  it("replaces an existing record with the same key instead of duplicating it", () => {
    upsertUnwrap(makeRecord({ status: "requesting" }));
    upsertUnwrap(makeRecord({ status: "requested", unwrapRequestId: "0xid" }));
    const all = listUnwraps();
    expect(all).toHaveLength(1);
    expect(all[0]!.status).toBe("requested");
    expect(all[0]!.unwrapRequestId).toBe("0xid");
  });

  it("orders records newest first", () => {
    upsertUnwrap(makeRecord({ key: "0xold", createdAt: 1000 }));
    upsertUnwrap(makeRecord({ key: "0xnew", createdAt: 2000 }));
    const all = listUnwraps();
    expect(all.map((r) => r.key)).toEqual(["0xnew", "0xold"]);
  });

  it("never evicts unfinished records even past the cap", () => {
    for (let i = 0; i < 60; i++) {
      upsertUnwrap(
        makeRecord({ key: `0xactive${i}`, status: "requested", createdAt: i }),
      );
    }
    expect(listUnwraps()).toHaveLength(60);
  });
});

describe("patchUnwrap", () => {
  it("merges a partial update and bumps updatedAt", () => {
    upsertUnwrap(makeRecord({ updatedAt: 1 }));
    const patched = patchUnwrap("0xkey1", { status: "finalized" });
    expect(patched?.status).toBe("finalized");
    expect(patched?.updatedAt).toBeGreaterThan(1);
    expect(listUnwraps()[0]!.status).toBe("finalized");
  });

  it("returns undefined for a key that doesn't exist", () => {
    expect(patchUnwrap("0xmissing", { status: "finalized" })).toBeUndefined();
  });
});

describe("removeUnwrap", () => {
  it("removes exactly the matching record", () => {
    upsertUnwrap(makeRecord({ key: "0xa" }));
    upsertUnwrap(makeRecord({ key: "0xb" }));
    removeUnwrap("0xa");
    expect(listUnwraps().map((r) => r.key)).toEqual(["0xb"]);
  });
});
