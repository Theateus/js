import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "recoverFor" function.
 */

type RecoverForParamsInternal = {
  from: AbiParameterToPrimitiveType<{ type: "address"; name: "from" }>;
  to: AbiParameterToPrimitiveType<{ type: "address"; name: "to" }>;
  recoveryDeadline: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "recoveryDeadline";
  }>;
  recoverySig: AbiParameterToPrimitiveType<{
    type: "bytes";
    name: "recoverySig";
  }>;
  toDeadline: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "toDeadline";
  }>;
  toSig: AbiParameterToPrimitiveType<{ type: "bytes"; name: "toSig" }>;
};

export type RecoverForParams = Prettify<
  | RecoverForParamsInternal
  | {
      asyncParams: () => Promise<RecoverForParamsInternal>;
    }
>;
/**
 * Calls the "recoverFor" function on the contract.
 * @param options - The options for the "recoverFor" function.
 * @returns A prepared transaction object.
 * @extension FARCASTER
 * @example
 * ```
 * import { recoverFor } from "thirdweb/extensions/farcaster";
 *
 * const transaction = recoverFor({
 *  from: ...,
 *  to: ...,
 *  recoveryDeadline: ...,
 *  recoverySig: ...,
 *  toDeadline: ...,
 *  toSig: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function recoverFor(options: BaseTransactionOptions<RecoverForParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xba656434",
      [
        {
          type: "address",
          name: "from",
        },
        {
          type: "address",
          name: "to",
        },
        {
          type: "uint256",
          name: "recoveryDeadline",
        },
        {
          type: "bytes",
          name: "recoverySig",
        },
        {
          type: "uint256",
          name: "toDeadline",
        },
        {
          type: "bytes",
          name: "toSig",
        },
      ],
      [],
    ],
    params: async () => {
      if ("asyncParams" in options) {
        const resolvedParams = await options.asyncParams();
        return [
          resolvedParams.from,
          resolvedParams.to,
          resolvedParams.recoveryDeadline,
          resolvedParams.recoverySig,
          resolvedParams.toDeadline,
          resolvedParams.toSig,
        ] as const;
      }

      return [
        options.from,
        options.to,
        options.recoveryDeadline,
        options.recoverySig,
        options.toDeadline,
        options.toSig,
      ] as const;
    },
  });
}
