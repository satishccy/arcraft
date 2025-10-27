import { Network } from './types';
import algosdk, { TransactionSigner } from 'algosdk';
/**
 * Utilities for interacting with the ARC-59 Router smart contract on Algorand.
 *
 * @remarks
 * ARC-59 defines an inbox-based routing scheme for ASAs. This class composes
 * transactions to send assets to a router, and for receivers to claim or reject
 * assets from their ARC-59 inbox. Read-only methods leverage simulation to
 * query contract state without sending transactions.
 */
export declare class Arc59 {
    /**
     * Resolve the ARC-59 router application ID and address for a given network.
     *
     * @param network - Target network, e.g. `'mainnet'` or `'testnet'`.
     * @returns Object containing `appId` and `appAddress`.
     * @example
     * ```ts
     * const { appId, appAddress } = Arc59.getAppInfo('testnet');
     * console.log(appId, appAddress);
     * ```
     */
    static getAppInfo(network: Network): {
        appId: number;
        appAddress: algosdk.Address;
    };
    /**
     * Simulate the send flow and fetch information required to send an asset via ARC-59.
     *
     * @param network - Target network.
     * @param assetId - ASA identifier to send.
     * @param receiver - Receiver's Algorand address.
     * @returns Simulation result including:
     * - `itxns`: total inner transactions expected
     * - `mbr`: minimum balance requirement to cover during the send
     * - `routerOptedIn`: whether the router is opted into the asset
     * - `receiverOptedIn`: whether the receiver is opted into the asset
     * - `receiverAlgoNeededForClaim`: ALGO needed by receiver to claim (in microalgos)
     * @throws Error if simulation fails or no return value is produced.
     * @example
     * ```ts
     * const info = await Arc59.getAssetSendInfo('testnet', 12345, receiverAddr);
     * if (!info.receiverOptedIn) {
     *   // compose routed send using Arc59.sendAsset
     * }
     * ```
     */
    static getAssetSendInfo(network: Network, assetId: number, receiver: string): Promise<{
        itxns: bigint;
        mbr: bigint;
        routerOptedIn: boolean;
        receiverOptedIn: boolean;
        receiverAlgoNeededForClaim: bigint;
    }>;
    /**
     * Check if an address is opted-in to a given ASA.
     *
     * @param network - Target network.
     * @param assetId - ASA identifier.
     * @param address - Account address to check.
     * @returns `true` if the account is opted-in, otherwise `false`.
     * @example
     * ```ts
     * const opted = await Arc59.isOptedIn('testnet', 12345, addr);
     * ```
     */
    static isOptedIn(network: Network, assetId: number, address: string): Promise<boolean>;
    /**
     * Get the ARC-59 inbox address for a receiver.
     *
     * @param network - Target network.
     * @param receiver - Receiver's Algorand address.
     * @returns The inbox account address, or the zero address if not created.
     * @throws Error if simulation does not return an inbox address.
     * @example
     * ```ts
     * const inbox = await Arc59.getInboxAddress('testnet', receiverAddr);
     * ```
     */
    static getInboxAddress(network: Network, receiver: string): Promise<string>;
    /**
     * Send an ASA to a receiver using ARC-59.
     *
     * If the receiver is already opted-in, a direct transfer is submitted. Otherwise,
     * a composed transaction group routes the asset through the ARC-59 router so the
     * receiver can later claim it from their inbox.
     *
     * @param params - Send parameters.
     * @param params.network - Target network.
     * @param params.assetId - ASA identifier to send.
     * @param params.amount - Amount to send (base units).
     * @param params.receiver - Receiver account address.
     * @param params.sender - Sender address and signer for authorizing transactions.
     * @returns The transaction ID of the submitted group (last tx for routed send, or lone transfer tx for direct send).
     * @example
     * ```ts
     * const txId = await Arc59.sendAsset({
     *   network: 'testnet',
     *   assetId: 12345,
     *   amount: 10,
     *   receiver: receiverAddr,
     *   sender: { address: senderAddr, signer }
     * });
     * ```
     */
    static sendAsset({ network, assetId, amount, receiver, sender, }: {
        network: Network;
        assetId: number;
        amount: number;
        receiver: string;
        sender: {
            address: string;
            signer: TransactionSigner;
        };
    }): Promise<string>;
    /**
     * List ASA holdings currently held in a receiver's ARC-59 inbox.
     *
     * @param params - Query parameters.
     * @param params.network - Target network.
     * @param params.receiver - Receiver's Algorand address.
     * @returns Array of assets in the inbox with `assetId`, `amount`, and `isFrozen`.
     * @example
     * ```ts
     * const assets = await Arc59.getAssetsInInbox({ network: 'testnet', receiver: addr });
     * ```
     */
    static getAssetsInInbox({ network, receiver, }: {
        network: Network;
        receiver: string;
    }): Promise<{
        assetId: number;
        amount: number;
        isFrozen: boolean;
    }[]>;
    /**
     * Claim a routed ASA from the receiver's ARC-59 inbox.
     *
     * If the receiver lacks the opt-in to the ASA, this method composes the opt-in
     * transaction automatically. If the inbox holds excess ALGO above min-balance,
     * a claim of ALGO is also composed so the fee covers the additional calls.
     *
     * @param params - Claim parameters.
     * @param params.network - Target network.
     * @param params.receiver - Receiver address and signer authorizing the claim.
     * @param params.assetId - ASA identifier to claim.
     * @returns The transaction ID of the submitted claim group.
     * @example
     * ```ts
     * const txId = await Arc59.claimAsset({
     *   network: 'testnet',
     *   receiver: { address: receiverAddr, signer },
     *   assetId: 12345,
     * });
     * ```
     */
    static claimAsset({ network, receiver, assetId, }: {
        network: Network;
        receiver: {
            address: string;
            signer: TransactionSigner;
        };
        assetId: number;
    }): Promise<string>;
    /**
     * Reject a routed ASA from the receiver's ARC-59 inbox.
     *
     * @param params - Reject parameters.
     * @param params.network - Target network.
     * @param params.receiver - Receiver address and signer authorizing the rejection.
     * @param params.assetId - ASA identifier to reject.
     * @returns The transaction ID of the submitted reject group.
     * @example
     * ```ts
     * const txId = await Arc59.rejectAsset({
     *   network: 'testnet',
     *   receiver: { address: receiverAddr, signer },
     *   assetId: 12345,
     * });
     * ```
     */
    static rejectAsset({ network, receiver, assetId, }: {
        network: Network;
        receiver: {
            address: string;
            signer: TransactionSigner;
        };
        assetId: number;
    }): Promise<string>;
}
