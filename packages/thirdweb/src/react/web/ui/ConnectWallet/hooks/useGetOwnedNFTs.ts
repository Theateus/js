import { useQuery } from "@tanstack/react-query";
import {
  type GetNFTsByOwnerParams,
  getNFTsByOwner,
} from "../../../../../chainsaw/endpoints/getNFTsByOwner.js";
import type { NFTs } from "../../../../../chainsaw/types.js";

export function useGetOwnedNFTs(params: GetNFTsByOwnerParams) {
  return useQuery<NFTs, Error>({
    queryKey: ["useGetOwnedNFTs", params],
    queryFn: async () => {
      const result = await getNFTsByOwner(params);
      return result.nfts;
    },
    enabled: !!params,
    retry: false,
  });
}
