/**
 * Core Algorand Asset module providing base functionality for working with Algorand Standard Assets.
 * @module coreAsset
 */
import { AssetParams } from 'algosdk/dist/types/client/v2/algod/models/types';
import { Network } from './types';
/**
 * Base class for working with Algorand Standard Assets (ASAs)
 * Provides core functionality for interacting with assets on the Algorand blockchain
 */
export declare class CoreAsset {
    /** The asset ID on the Algorand blockchain */
    id: number;
    /** The asset parameters retrieved from the Algorand blockchain */
    assetParams: AssetParams;
    /**
     * Creates an instance of CoreAsset
     * @param id - The asset ID
     * @param assetParams - The asset parameters
     */
    protected constructor(id: number, assetParams: AssetParams);
    /**
     * Creates a CoreAsset instance from an asset ID
     * @param id - The asset ID to load
     * @param network - The Algorand network to use
     * @returns A promise resolving to a CoreAsset instance
     */
    static fromId(id: number, network: Network): Promise<CoreAsset>;
    /**
     * Fetches asset parameters from the Algorand blockchain
     * @param id - The asset ID to fetch
     * @param network - The Algorand network to use
     * @returns A promise resolving to the asset parameters
     */
    static fetchAssetParams(id: number, network: Network): Promise<AssetParams>;
    /**
     * Gets the asset parameters
     * @returns The asset parameters
     */
    get(): AssetParams;
    /**
     * Gets the creator address of the asset
     * @returns The creator address
     */
    getCreator(): string;
    /**
     * Gets the clawback address of the asset
     * @returns The clawback address or the zero address if not set
     */
    getClawback(): string;
    /**
     * Gets the freeze address of the asset
     * @returns The freeze address or the zero address if not set
     */
    getFreeze(): string;
    /**
     * Gets the reserve address of the asset
     * @returns The reserve address or the zero address if not set
     */
    getReserve(): string;
    /**
     * Gets the manager address of the asset
     * @returns The manager address or the zero address if not set
     */
    getManager(): string;
    /**
     * Checks if the asset has a clawback address
     * @returns True if the asset has a clawback address
     */
    hasClawback(): boolean;
    /**
     * Checks if the asset has a freeze address
     * @returns True if the asset has a freeze address
     */
    hasFreeze(): boolean;
    /**
     * Checks if the asset has a reserve address
     * @returns True if the asset has a reserve address
     */
    hasReserve(): boolean;
    /**
     * Checks if the asset has a manager address
     * @returns True if the asset has a manager address
     */
    hasManager(): boolean;
    /**
     * Gets the asset ID
     * @returns The asset ID
     */
    getIndex(): number;
    /**
     * Gets the asset name
     * @returns The asset name or empty string if not set
     */
    getName(): string;
    /**
     * Gets the asset unit name
     * @returns The asset unit name or empty string if not set
     */
    getUnitName(): string;
    /**
     * Gets the asset decimals
     * @returns The number of decimals for the asset
     */
    getDecimals(): number;
    /**
     * Gets the total supply in base units
     * @returns The total supply in base units
     */
    getTotal(): number;
    /**
     * Gets the total supply adjusted for decimals
     * @returns The total supply adjusted for decimals
     */
    getTotalSupply(): number;
    /**
     * Converts an amount from base units to decimal-adjusted units
     * @param amount - The amount in base units
     * @returns The amount adjusted for decimals
     */
    getAmountInDecimals(amount: number): number;
    /**
     * Converts an amount from decimal-adjusted units to base units
     * @param amount - The amount in decimal-adjusted units
     * @returns The amount in base units
     */
    getAmountInBaseUnits(amount: number): number;
    /**
     * Gets whether the asset is frozen by default
     * @returns True if the asset is frozen by default
     */
    getDefaultFrozen(): boolean;
    /**
     * Gets the asset URL
     * @returns The asset URL or empty string if not set
     */
    getUrl(): string;
    /**
     * Gets the asset metadata hash
     * @returns The metadata hash as a string
     */
    getMetadataHash(): string;
    /**
     * Gets the protocol part of the asset URL
     * @returns The URL protocol or empty string if not found
     */
    getUrlProtocol(): string;
    /**
     * Checks if the asset URL uses HTTP or HTTPS protocol
     * @returns True if the URL uses HTTP or HTTPS
     */
    hasHttpUrl(): boolean;
    /**
     * Checks if the asset URL uses IPFS protocol
     * @returns True if the URL uses IPFS
     */
    hasIpfsUrl(): boolean;
    /**
     * Checks if the asset URL uses template-ipfs protocol
     * @returns True if the URL uses template-ipfs
     */
    hasTemplateUrl(): boolean;
}
