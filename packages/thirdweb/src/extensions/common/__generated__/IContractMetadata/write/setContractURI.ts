import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "setContractURI" function.
 */

type SetContractURIParamsInternal = {
  uri: AbiParameterToPrimitiveType<{ type: "string"; name: "_uri" }>;
};

export type SetContractURIParams = Prettify<
  | SetContractURIParamsInternal
  | {
      asyncParams: () => Promise<SetContractURIParamsInternal>;
    }
>;
/**
 * Calls the "setContractURI" function on the contract.
 * @param options - The options for the "setContractURI" function.
 * @returns A prepared transaction object.
 * @extension COMMON
 * @example
 * ```
 * import { setContractURI } from "thirdweb/extensions/common";
 *
 * const transaction = setContractURI({
 *  uri: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function setContractURI(
  options: BaseTransactionOptions<SetContractURIParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x938e3d7b",
      [
        {
          type: "string",
          name: "_uri",
        },
      ],
      [],
    ],
    params: async () => {
      if ("asyncParams" in options) {
        const resolvedParams = await options.asyncParams();
        return [resolvedParams.uri] as const;
      }

      return [options.uri] as const;
    },
  });
}
