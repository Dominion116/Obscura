"use client";

// Faucet (PRD §7.5). The official cTokenMock underlyings all expose an
// unrestricted mint(address,uint256) — verified by simulating a mint from an
// arbitrary EOA against every mock on Sepolia — so the faucet mints directly
// from the user's wallet and no custom faucet contract is needed.

import { useCallback, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAccount, useWriteContract } from "wagmi";
import {
  KNOWN_WRAPPERS,
  mockErc20Abi,
  SEPOLIA_CHAIN_ID,
  type Address,
  type Hex,
} from "@obscura/shared";
import { publicClient } from "@/lib/viem";
import { humanizeWriteError } from "@/lib/errors";

export const FAUCET_MOCKS = KNOWN_WRAPPERS.filter((w) => w.isMock);

/** Whole tokens minted per click; scaled by each token's own decimals. */
export const FAUCET_TOKENS_PER_MINT = 1_000n;

export interface FaucetToken {
  underlying: Address;
  wrapperSymbol: string;
  symbol: string;
  name: string;
  decimals: number;
  /** Undefined until a wallet is connected. */
  balance?: bigint;
}

/**
 * On-chain metadata (and balance, once connected) for every official mock.
 * The reads batch into a single multicall through the shared public client.
 */
export function useFaucetTokens() {
  const { address } = useAccount();
  return useQuery({
    queryKey: ["faucet-tokens", address],
    refetchInterval: 30_000,
    queryFn: async (): Promise<FaucetToken[]> =>
      Promise.all(
        FAUCET_MOCKS.map(async (mock) => {
          const token = { address: mock.underlying, abi: mockErc20Abi } as const;
          const [symbol, name, decimals, balance] = await Promise.all([
            publicClient.readContract({ ...token, functionName: "symbol" }),
            publicClient.readContract({ ...token, functionName: "name" }),
            publicClient.readContract({ ...token, functionName: "decimals" }),
            address
              ? publicClient.readContract({
                  ...token,
                  functionName: "balanceOf",
                  args: [address],
                })
              : Promise.resolve(undefined),
          ]);
          return {
            underlying: mock.underlying,
            wrapperSymbol: mock.symbol,
            symbol,
            name,
            decimals,
            balance,
          };
        }),
      ),
  });
}

export function useMintMock() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const queryClient = useQueryClient();
  /** Underlying address of the mint currently in flight, if any. */
  const [minting, setMinting] = useState<Address | null>(null);

  const mint = useCallback(
    async (token: FaucetToken): Promise<Hex> => {
      if (!address) throw new Error("Connect a wallet first.");
      setMinting(token.underlying);
      try {
        const amount =
          FAUCET_TOKENS_PER_MINT * 10n ** BigInt(token.decimals);
        const hash = await writeContractAsync({
          chainId: SEPOLIA_CHAIN_ID,
          address: token.underlying,
          abi: mockErc20Abi,
          functionName: "mint",
          args: [address, amount],
        });
        const receipt = await publicClient.waitForTransactionReceipt({ hash });
        if (receipt.status !== "success") {
          throw new Error("The mint transaction reverted.");
        }
        void queryClient.invalidateQueries({ queryKey: ["faucet-tokens"] });
        void queryClient.invalidateQueries({ queryKey: ["erc20-balance"] });
        return hash;
      } catch (err) {
        throw new Error(humanizeWriteError(err));
      } finally {
        setMinting(null);
      }
    },
    [address, writeContractAsync, queryClient],
  );

  return { mint, minting };
}
