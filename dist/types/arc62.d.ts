import { Network } from './types';
/**
 * The Arc62 class provides methods for interacting with the ARC-62 standard,
 * which defines a standardized way to determine an asset's circulating supply.
 *
 * This class can check if an asset is ARC-62 compatible and fetch its
 * circulating supply, either by calling the on-chain contract method or by
 * using a fallback calculation for non-compliant assets.
 */
export declare class Arc62 {
    /**
     * Checks if an asset is compatible with the ARC-62 standard.
     *
     * It first inspects the asset's metadata for an `arc-62` property. If not found,
     * it queries the indexer for historical asset configuration transactions with a
     * note prefix of `arc62:` to find the associated smart contract.
     *
     * @param assetId The ID of the asset to check.
     * @param network The network to use ('mainnet' or 'testnet').
     * @returns A promise that resolves to an object containing a boolean `compatible`
     *          and the `applicationId` if found (0 otherwise).
     * @example
     * ```ts
     * const arc62AssetId = 733094741; // An ARC-62 asset on TestNet
     * const result = await Arc62.isArc62Compatible(arc62AssetId, 'testnet');
     *
     * if (result.compatible) {
     *   console.log(`Asset is ARC-62 compatible with App ID: ${result.applicationId}`);
     * } else {
     *   console.log('Asset is not ARC-62 compatible.');
     * }
     * ```
     */
    static isArc62Compatible(assetId: number, network: Network): Promise<{
        compatible: boolean;
        applicationId: number;
    }>;
    /**
     * Gets the circulating supply of a given asset.
     *
     * If the asset is ARC-62 compatible, this method calls the
     * `arc62_get_circulating_supply` method on the associated smart contract
     * for an on-chain, verifiable result.
     *
     * If the asset is not ARC-62 compatible, it calculates the circulating supply
     * using a fallback formula: `Total Supply - Burned Amount (from ARC-54) - Reserve Amount`.
     *
     * @param assetId The ID of the asset to check.
     * @param network The network to use ('mainnet' or 'testnet').
     * @returns A promise that resolves to the circulating supply of the asset as a number.
     * @example
     * ```ts
     * const arc62AssetId = 733094741; // An ARC-62 asset on TestNet
     * const nonArc62AssetId = 10458941; // A regular asset on TestNet
     *
     * // Gets supply from the smart contract
     * const onChainSupply = await Arc62.getCirculatingSupply(arc62AssetId, 'testnet');
     * console.log(`On-chain circulating supply: ${onChainSupply}`);
     *
     * // Gets supply using the fallback calculation
     * const fallbackSupply = await Arc62.getCirculatingSupply(nonArc62AssetId, 'testnet');
     * console.log(`Fallback circulating supply: ${fallbackSupply}`);
     * ```
     */
    static getCirculatingSupply(assetId: number, network: Network): Promise<number>;
}
