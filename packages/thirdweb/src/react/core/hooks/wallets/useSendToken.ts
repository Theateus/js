import { useMutation } from "@tanstack/react-query";
import type { ThirdwebClient } from "../../../../client/client.js";
import { getContract } from "../../../../contract/contract.js";
import { resolveAddress as resolveEnsAddress } from "../../../../extensions/ens/resolve-address.js";
import { transfer } from "../../../../extensions/erc20/write/transfer.js";
import { resolveAddress as resolveLensAddress } from "../../../../extensions/lens/read/resolveAddress.js";
import { sendTransaction } from "../../../../transaction/actions/send-transaction.js";
import { prepareTransaction } from "../../../../transaction/prepare-transaction.js";
import { toWei } from "../../../../utils/units.js";
import { useActiveWallet } from "./useActiveWallet.js";

/**
 * Send Native or ERC20 tokens from active wallet to given address.
 * @example
 * ```tsx
 * const { mutate: sendToken } = useSendToken(client);
 *
 * // send native currency
 * sendToken({
 *    receiverAddress: "0x...",
 *    amount: "0.1",
 * });
 *
 * // send ERC20
 * sendToken({
 *   tokenAddress,
 *   receiverAddress: "0x...",
 *   amount: "0.5",
 * });
 * ```
 * @wallet
 */
export function useSendToken(client: ThirdwebClient) {
  const wallet = useActiveWallet();
  return useMutation({
    async mutationFn(option: {
      tokenAddress?: string;
      receiverAddress: string;
      amount: string;
    }) {
      const { tokenAddress, receiverAddress, amount } = option;
      const activeChain = wallet?.getChain();
      const account = wallet?.getAccount();

      // state validation
      if (!activeChain) {
        throw new Error("No active chain");
      }
      if (!account) {
        throw new Error("No active account");
      }

      if (!amount || Number.isNaN(Number(amount)) || Number(amount) < 0) {
        throw new Error("Invalid amount");
      }

      let to = receiverAddress;
      // resolve ENS or Lens handle if needed
      // There will never be a Lens handle that is the same as an ENS because Lens does not allow "." to be in the name
      // so we can avoid the scenario where there is a "vitalik.eth" for ENS and there is a "vitalik.eth" for Lens
      // and each is owned by a different person.
      const [ensAddress, lensAddress] = await Promise.all([
        resolveEnsAddress({
          client,
          name: receiverAddress,
        }).catch(() => ""),
        resolveLensAddress({
          client,
          handleOrLocalName: receiverAddress,
        }).catch(() => ""),
      ]);
      to = ensAddress || lensAddress;

      if (!to) {
        throw new Error("Failed to resolve address");
      }

      // native token transfer
      if (!tokenAddress) {
        const sendNativeTokenTx = prepareTransaction({
          chain: activeChain,
          client,
          to,
          value: toWei(amount),
        });

        await sendTransaction({
          transaction: sendNativeTokenTx,
          account,
        });
      }

      // erc20 token transfer
      else {
        const contract = getContract({
          address: tokenAddress,
          client,
          chain: activeChain,
        });

        const tx = transfer({
          amount,
          contract,
          to,
        });

        await sendTransaction({
          transaction: tx,
          account,
        });
      }
    },
  });
}
