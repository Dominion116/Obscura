import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { sepolia } from "@reown/appkit/networks";
import { cookieStorage, createStorage, http } from "wagmi";
import { env } from "@/config/env";

// A missing project id only breaks the wallet modal, not the whole app,
// so warn loudly instead of throwing during build.
if (!env.reownProjectId && typeof window !== "undefined") {
  console.warn(
    "NEXT_PUBLIC_REOWN_PROJECT_ID is not set, so wallet connection is disabled. " +
      "Create a project at https://cloud.reown.com and add it to .env.local",
  );
}

export const networks = [sepolia];

export const wagmiAdapter = new WagmiAdapter({
  projectId: env.reownProjectId,
  networks,
  transports: {
    [sepolia.id]: http(env.sepoliaRpcUrl),
  },
  storage: createStorage({ storage: cookieStorage }),
  ssr: true,
});

export const wagmiConfig = wagmiAdapter.wagmiConfig;
