# Obscura

**The Confidential Wrapper Registry, made usable.**

Obscura is a production-ready web application built on the [Zama Confidential Token Wrappers Registry](https://docs.zama.org/protocol/protocol-apps/confidential-tokens/wrapper-registry). It surfaces every ERC-20 to ERC-7984 wrapper pair registered on Ethereum Sepolia, lets anyone wrap and unwrap tokens, decrypts confidential balances entirely client-side, and ships a faucet for the official cTokenMocks so testers always have tokens to work with.

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
| **Registry explorer** | Every registered pair with underlying token, confidential wrapper, conversion rate, wrapper decimals, Total Value Shielded, and a clear valid/revoked badge. Search by symbol or address, filter by validity. Revoked pairs are visibly labelled and blocked from wrapping. |
| **Wrap** | Approve-then-wrap flow with a live preview of the rounded amount that will actually wrap and the excess that will be refunded (wrappers cap at six decimals and round down). |
| **Unwrap** | The two-step asynchronous flow implemented as an explicit state machine: request → public decryption → finalize. Every failure mode has an explicit state and a retry path. |
| **Balance decryption** | Encrypted balances stay hidden by default. One click signs a typed-data request and decrypts the balance client-side, visible only to the holder. |
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
| `NEXT_PUBLIC_API_URL` | Base URL of the Obscura API once deployed |
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

## Key addresses (Sepolia)

| Contract | Address |
| --- | --- |
| Confidential Token Wrappers Registry | [`0x2f0750Bbb0A246059d80e94c454586a7F27a128e`](https://sepolia.etherscan.io/address/0x2f0750Bbb0A246059d80e94c454586a7F27a128e) |

The full list of official wrapper pairs (cUSDCMock, cUSDTMock, cWETHMock, cBRONMock, cZAMAMock, ctGBPMock, cXAUtMock, ctGBP) lives in [`packages/shared/src/addresses/sepolia.ts`](packages/shared/src/addresses/sepolia.ts). The app always treats the on-chain registry as the source of truth; the static list is a convenience snapshot for the faucet.

ABIs in the shared package were pulled from **Sourcify exact-match verifications** of the deployed implementation contracts, not transcribed by hand.

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
