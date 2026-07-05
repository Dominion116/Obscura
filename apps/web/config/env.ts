// Client-safe environment access. All values here are NEXT_PUBLIC_ and
// therefore compiled into the bundle; never add secrets to this file.

export const env = {
  reownProjectId: process.env.NEXT_PUBLIC_REOWN_PROJECT_ID ?? "",
  sepoliaRpcUrl:
    process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL ??
    "https://ethereum-sepolia-rpc.publicnode.com",
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "",
  // The developer reference is a separate Nextra site (apps/docs).
  docsUrl: process.env.NEXT_PUBLIC_DOCS_URL ?? "http://localhost:3001",
} as const;
