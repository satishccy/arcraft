import algosdk, { TransactionSigner } from 'algosdk';
import { Network } from './types';
/**
 * The Arc54 class provides methods for interacting with the ARC54 contract.
 */
export declare class Arc54 {
    /**
     * Get the application ID and address for the ARC54 contract on a given network.
     * @param network The network to use.
     * @returns An object containing the application ID and address.
     */
    static getAppInfo(network: Network): {
        appId: number;
        appAddress: algosdk.Address;
    };
    /**
     * Check if an address is opted into a specific asset.
     * @param network The network to use.
     * @param assetId The ID of the asset to check.
     * @param address The address to check.
     * @returns A boolean indicating whether the address is opted in.
     */
    static isOptedIn(network: Network, assetId: number, address: string): Promise<boolean>;
    /**
     * Burn a specific amount of an asset.
     * @param network The network to use.
     * @param assetId The ID of the asset to burn.
     * @param amount The amount of the asset to burn.
     * @param sender The sender's address and signer.
     * @returns The transaction ID.
     */
    static burnAsset(network: Network, assetId: number, amount: number, sender: {
        address: string;
        signer: TransactionSigner;
    }): Promise<string>;
    /**
     * Get the total amount of a specific asset that has been burned.
     * @param network The network to use.
     * @param assetId The ID of the asset to check.
     * @returns The total amount of the asset that has been burned.
     */
    static getBurnedAmount(network: Network, assetId: number): Promise<bigint>;
}
