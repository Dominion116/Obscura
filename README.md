# Obscura

**The Confidential Wrapper Registry, made usable.**

Obscura is a production-ready web application built on the [Zama Confidential Token Wrappers Registry](https://docs.zama.org/protocol/protocol-apps/confidential-tokens/wrapper-registry). It surfaces every ERC-20 to ERC-7984 wrapper pair registered on Ethereum Sepolia, lets anyone wrap and unwrap tokens, decrypts confidential balances entirely client-side, and ships a faucet for the official cTokenMocks so testers always have tokens to work with. The registry explorer can also browse the Ethereum mainnet registry read-only, so the production pairs are just as discoverable.

**Live app:** https://obs-cura.vercel.app
**Developer docs:** https://obscura-doc.vercel.app

---

## Why Obscura exists

Many developers spin up their own ERC-20 test tokens and their own ERC-7984 wrappers rather than using the ones already published in the official Zama Wrappers Registry. Every team that does this creates a parallel set of tokens nobody else recognises, fragmenting the ecosystem and making it harder for confidential applications to interoperate.

The registry already exists to solve this, but there was no polished product that made it easy to browse, trust, and use. Obscura closes three practical gaps in one application:

- **Discovery**: a friendly surface that lists every registered pair and clearly separates valid wrappers from revoked ones.
- **Usability**: wrapping is simple, but unwrapping is a two-step asynchronous flow that most interfaces handle poorly, and reading an encrypted balance requires a signed decryption step unfamiliar to newcomers. Obscura guides both.
- **Adoption**: a working, readable reference that shows developers exactly how to talk to the registry and the wrappers, so they reuse the pieces instead of reinventing them.

## Features

| Feature | Description |
| --- | --- |
| **Registry explorer** | Every registered pair with underlying token, confidential wrapper, conversion rate, wrapper decimals, Total Value Shielded, and a clear valid/revoked badge. Search by symbol or address, filter by validity, and switch between Sepolia and the read-only Ethereum mainnet registry. Revoked pairs are visibly labelled and blocked from wrapping. |
| **Wrap** | Approve-then-wrap flow with a live preview of the rounded amount that will actually wrap and the excess that will be refunded (wrappers cap at six decimals and round down). |
| **Unwrap** | The two-step asynchronous flow implemented as an explicit state machine: request → public decryption → finalize. Every failure mode has an explicit state and a retry path. |
| **Balance decryption** | Encrypted balances stay hidden by default. One click signs a typed-data request and decrypts the balance client-side, visible only to the holder. |
| **Decrypt any token** | Paste the address of any ERC-7984 token on Sepolia, registry-listed or not, and decrypt the connected wallet's balance on it through the same EIP-712 user-decryption flow. Lives on the Portfolio page. |
| **Custom pairs** | Declare custom or dev-only ERC-20 ↔ ERC-7984 pairs in a local config file. They appear in the explorer with a Custom badge and support the full wrap, unwrap, and decrypt surface. |
| **Confidential transfer** | Send wrapped tokens with the amount encrypted, demonstrating the full ERC-7984 surface. |
| **Portfolio** | Aggregated confidential holdings across every wrapper, decryptable on demand, plus pending and historical unwrap requests. |
| **Faucet** | One-click minting of the official cTokenMocks on Sepolia. |
| **Activity feed** | Live stream of wraps, unwraps, registrations, and revocations across the whole registry, using only public on-chain data. |
| **Developer reference** | Sepolia addresses, copy-ready snippets for every action, documented hooks, and an install-to-first-wrap integration guide. |

## The two decryption paths

Obscura uses both decryption paths the Zama protocol provides, and keeps them deliberately distinct:

- **User decryption**: a signed typed-data request lets a holder read their own encrypted balance privately, client-side. Nothing is revealed on chain.
- **Public decryption**: used *only* where the protocol requires a value to become public: the unwrap amount during finalization.

No private data ever touches a server. The indexer stores only public, on-chain-derived events.

## Architecture

```
┌────────────────┐     wagmi/viem      ┌──────────────────────┐
│                │ ──────────────────► │  Sepolia             │
│   Next.js 15   │                     │  · Wrappers Registry │
│   web app      │     Relayer SDK     │  · ERC-7984 wrappers │
│                │ ──────────────────► │  · cTokenMocks       │
└──────┬─────────┘   (encrypt/decrypt) └──────────┬───────────┘
       │  cached reads                            │ events
       ▼                                          ▼
┌────────────────┐                     ┌──────────────────────┐
│  REST API      │ ◄─────────────────  │  Node indexer        │
│  /pairs /stats │      MongoDB        │  resumable, gap-free │
│  /activity     │                     │  backfill on boot    │
└────────────────┘                     └──────────────────────┘
```

- **Web app**: renders every page, talks to the chain through wagmi and viem, and runs all confidential operations client-side through the Zama Relayer SDK.
- **Indexer and API**: a Node service that listens to registry and wrapper events, stores pairs, activity, and TVS snapshots in MongoDB, and serves cached reads. It never touches private data.
- **Shared package**: a single source of truth for ABIs, Sepolia addresses, and TypeScript types, imported by both sides to prevent drift.

## Tech stack

| Layer | Choice |
| --- | --- |
| Frontend | Next.js 15, React 19, App Router |
| Styling | Tailwind CSS v4, shadcn/ui theme (dark mode) |
| Motion | motion (Framer Motion v12), blur-in reveals |
| Chain reads and writes | wagmi + viem, fully typed contract hooks |
| Wallet | Reown AppKit |
| Confidential operations | Zama Relayer SDK (input proofs, user + public decryption) |
| Backend | Node + Express event indexer and REST API |
| Database | MongoDB Atlas + Mongoose |
| Monorepo | Turborepo + npm workspaces |

## Monorepo layout

```
obscura/
  apps/
    web/                 Next.js frontend
      app/               App Router: (marketing) landing, (app) functional pages, developers
      components/        landing, shared chrome, feature components
      hooks/             useRegistry, useWrap, useUnwrap, useDecrypt
      lib/               fhevm client, wagmi/reown config, utilities
      providers/         wagmi, react-query, appkit bootstrap
      config/            client-safe env access
    docs/                Standalone Nextra developer reference
    api/                 Node/Express indexer + REST API
  packages/
    shared/              ABIs (verified via Sourcify), Sepolia addresses, types
    config/              shared tsconfig bases
```

## Getting started

**Prerequisites:** Node.js ≥ 20, npm ≥ 10.

```bash
# install dependencies
npm install

# configure the web app
cp .env.example apps/web/.env.local
# then set NEXT_PUBLIC_REOWN_PROJECT_ID, create a free project at https://cloud.reown.com

# run everything
npm run dev
```

The web app runs at `http://localhost:3000`.

### Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_REOWN_PROJECT_ID` | Reown AppKit project id for wallet connection |
| `NEXT_PUBLIC_SEPOLIA_RPC_URL` | Sepolia RPC endpoint (public default provided) |
| `NEXT_PUBLIC_MAINNET_RPC_URL` | Ethereum mainnet RPC endpoint, used only to browse the mainnet registry read-only (public default provided) |
| `NEXT_PUBLIC_API_URL` | Base URL of the Obscura API once deployed |
| `NEXT_PUBLIC_SITE_URL` | Set on apps/web; canonical URL and social preview metadata base: `https://obs-cura.vercel.app` |
| `NEXT_PUBLIC_DOCS_URL` | Set on apps/web; points at the deployed docs site: `https://obscura-doc.vercel.app` |
| `NEXT_PUBLIC_APP_URL` | Set on apps/docs; points at the deployed web app: `https://obs-cura.vercel.app` |
| `MONGODB_URI` | MongoDB Atlas connection string (indexer/API) |
| `SEPOLIA_RPC_URL` | RPC endpoint for the indexer |

### Scripts

| Command | Effect |
| --- | --- |
| `npm run dev` | Run all workspace dev servers through Turborepo |
| `npm run build` | Production build of every workspace |
| `npm run typecheck` | TypeScript checks across the monorepo |
| `npm run lint` | Lint every workspace |

## Supported networks

| Network | Support |
| --- | --- |
| Ethereum Sepolia | Full: browse, wrap, unwrap, confidential transfer, balance decryption, faucet |
| Ethereum mainnet | Registry browsing (read-only): every production pair with metadata, rate, TVS, and Etherscan links |

Sepolia is the interactive network; every flow judges or testers need runs there against the official cTokenMocks. The mainnet registry is surfaced so the production pairs (cUSDC, cUSDT, cWETH, and the rest) are discoverable from the same explorer, but no wallet ever connects to mainnet from Obscura.

## Key addresses

| Contract | Network | Address |
| --- | --- | --- |
| Confidential Token Wrappers Registry | Sepolia | [`0x2f0750Bbb0A246059d80e94c454586a7F27a128e`](https://sepolia.etherscan.io/address/0x2f0750Bbb0A246059d80e94c454586a7F27a128e) |
| Confidential Token Wrappers Registry | Ethereum mainnet | [`0xeb5015fF021DB115aCe010f23F55C2591059bBA0`](https://etherscan.io/address/0xeb5015fF021DB115aCe010f23F55C2591059bBA0) |

The full list of official wrapper pairs (cUSDCMock, cUSDTMock, cWETHMock, cBRONMock, cZAMAMock, ctGBPMock, cXAUtMock, ctGBP) lives in [`packages/shared/src/addresses/sepolia.ts`](packages/shared/src/addresses/sepolia.ts). The app always treats the on-chain registry as the source of truth; the static list is a convenience snapshot for the faucet.

ABIs in the shared package were pulled from **Sourcify exact-match verifications** of the deployed implementation contracts, not transcribed by hand.

## How the registry is sourced

The pair list is hybrid, with a strict priority order:

1. **On-chain Wrappers Registry (primary source of truth).** The app pages through `getTokenConfidentialTokenPairsSlice` on the official registry contract at every load and refreshes each minute, so pairs that Zama registers or revokes appear automatically, with no code change or redeploy.
2. **Local custom-pairs config (additive).** [`apps/web/config/custom-pairs.ts`](apps/web/config/custom-pairs.ts) declares extra pairs that are not (or not yet) in the official registry: dev-only wrappers, wrappers under review, or private test deployments. These are merged in after the registry pairs and shown with a **Custom** badge so nobody mistakes them for registry-validated entries.
3. **Pairs added from the registry UI (additive, per browser).** The **Add a pair** control on the registry page lets a visitor declare a pair without touching code. It is checked on-chain before being accepted (the token must answer `decimals()`, the wrapper must answer `rate()`) and then stored in that browser's `localStorage`, so it is visible only to the person who added it, never to other visitors. These show a **Local** badge and can be removed from the same panel.

Conflicts resolve in the registry's favour, then the local config's: if a wrapper declared in the local config or added through the UI later gets registered on-chain (or added to the local config), the lower-priority entry is ignored automatically. Custom and locally-added pairs support the same wrap, unwrap, transfer, and decrypt flows as registry pairs.

## Adding a new pair

There are three paths, depending on whether the pair is official, meant to ship for everyone, or just for you to try out.

### Official pairs: register on-chain, zero app changes

The registry is the source of truth, so the correct way to add an official pair is to have it registered in the Zama Wrappers Registry (registration is permissioned and goes through Zama; see the [wrapper registry docs](https://docs.zama.org/protocol/protocol-apps/confidential-tokens/wrapper-registry)). The moment the `ConfidentialTokenRegistered` event lands, Obscura picks the pair up on its next refresh. No code change, no redeploy.

### Custom or dev-only pairs, for everyone: one entry in the local config

For a wrapper that is not in the official registry (for example, one you deployed yourself while developing) and that you want every visitor to see, add its addresses to [`apps/web/config/custom-pairs.ts`](apps/web/config/custom-pairs.ts):

```ts
export const CUSTOM_PAIRS: readonly CustomPairConfig[] = [
  {
    // Your ERC-20 underlying token on Sepolia
    tokenAddress: "0x9b5Cd13b8eFbB58Dc25A05CF411D8056058aDFfF",
    // Its ERC-7984 confidential wrapper on Sepolia
    confidentialTokenAddress: "0x7c5BF43B851c1dff1a4feE8dB225b87f2C223639",
  },
];
```

That is the whole change. Symbol, name, decimals, conversion rate, and TVS are read on-chain from the two contracts, so only the addresses are declared. After a redeploy (`npm run build` or a push to the hosting branch), the pair appears in the registry explorer with a **Custom** badge, and every flow works against it: wrap, unwrap, confidential transfer, portfolio, and balance decryption.

Requirements for the wrapper contract: it must implement the ERC-7984 confidential token surface used by the app (`wrap`, `unwrap`/`finalizeUnwrap`, `confidentialBalanceOf`, `rate`, `decimals`), which any wrapper built from Zama's confidential token contracts does.

### Your own pair, no redeploy: the registry page's "Add a pair" form

For trying out a wrapper without editing code at all, open the [registry page](https://obs-cura.vercel.app/registry) (or `/registry` locally), click **Add a pair**, and paste the ERC-20 and ERC-7984 wrapper addresses. The app checks both contracts on-chain before accepting them, then stores the pair in your browser's `localStorage` under a **Local** badge; it is visible only to you, not other visitors, and can be removed from the same panel. This is the fastest way to confirm a wrapper works with Obscura before deciding whether it belongs in `custom-pairs.ts` for everyone.

## Deployment

| Piece | Where | How |
| --- | --- | --- |
| Web app (`apps/web`) | Vercel | Import the repo, set the root to `apps/web`, add the `NEXT_PUBLIC_*` env vars from the table above |
| Docs (`apps/docs`) | Vercel | Same, with root `apps/docs` |
| Indexer + API (`apps/api`) | Render | [`render.yaml`](render.yaml) is a ready Render Blueprint: New → Blueprint → select this repo, then supply `MONGODB_URI` and `SEPOLIA_RPC_URL` when prompted |
| Database | MongoDB Atlas | A free-tier cluster is sufficient; the indexer creates its collections on boot |

## Correctness rules the app never breaks

- The registry's `isValid` flag is checked on every read; revoked wrappers are labelled and blocked from wrapping.
- Wrap previews respect the six-decimal cap: rounded amount and refund are shown before signing.
- The unwrap sequence is exactly: `unwrap()` → public decryption of the emitted amount → `finalizeUnwrap(id, cleartext, proof)`.
- ACL permissions are checked before any ciphertext is used.
- User decryption and public decryption are never conflated, in code or in UI copy.

## Roadmap

- Registry explorer with search, filters, and per-pair detail
- Wrap flow with refund preview + cTokenMock faucet
- Two-step async unwrap state machine + user decryption of balances
- Portfolio with decrypt-on-demand and pending unwrap tracking
- Indexer, REST API, activity feed, and TVS analytics
- Developer reference with runnable snippets
- Polish, QA, deployment

## License

MIT
