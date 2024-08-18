import { thirdwebClient } from "@/constants/client";
import { useQuery } from "@tanstack/react-query";
import type { ThirdwebContract } from "thirdweb";
import { getCompilerMetadata } from "thirdweb/contract";
import { download } from "thirdweb/storage";
import invariant from "tiny-invariant";

// An example for a contract that has IPFS URIs in its metadata: abstract-testnet/0x8A24a7Df38fA5fCCcFD1259e90Fb6996fDdfcADa

export function useContractSources(contract?: ThirdwebContract) {
  return useQuery({
    queryKey: [
      "contract-sources",
      contract?.chain.id || "",
      contract?.address || "",
    ],
    queryFn: async (): Promise<Array<{ filename: string; source: string }>> => {
      invariant(contract, "contract is required");
      const data = await getCompilerMetadata(contract);
      const sources = data.metadata.sources || {};
      return await Promise.all(
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        Object.entries(sources).map(async ([path, info]: [string, any]) => {
          const urls = info.urls as string[];
          const ipfsLink = urls
            ? urls.find((url) => url.includes("ipfs"))
            : undefined;
          if (ipfsLink) {
            const ipfsHash = ipfsLink.split("ipfs/")[1];
            const source = await download({
              uri: `ipfs://${ipfsHash}`,
              client: thirdwebClient,
            }).then((r) => r.text());
            return {
              filename: path,
              source,
            };
          }
          return {
            filename: path,
            source: info.content || "Could not find source for this contract",
          };
        }),
      );
    },
    enabled: !!contract,
  });
}
