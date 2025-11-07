/**
 * Implementation of the Algorand ARC-3 standard for NFTs.
 * @module arc3
 */
import { AssetParams } from 'algosdk/dist/types/client/v2/algod/models/types';
import { CoreAsset } from './coreAsset';
import { Network } from './types';
import algosdk, { TransactionSigner } from 'algosdk';
import { IPFS } from './ipfs';
/**
 * Class representing an ARC-3 compliant NFT on Algorand.
 * Extends CoreAsset with metadata handling for the ARC-3 standard.
 */
declare class Arc3 extends CoreAsset {
    /** The metadata associated with this ARC-3 asset */
    metadata: any;
    /**
     * Creates an instance of Arc3.
     * @param id - The asset ID
     * @param params - The asset parameters from the Algorand blockchain
     * @param network - The Algorand network this asset exists on
     * @param metadata - The metadata associated with the asset
     */
    private constructor();
    /**
     * Fetches metadata from a given URL
     * @param url - The URL to fetch metadata from
     * @returns A promise resolving to the metadata object
     * @throws Error if metadata cannot be fetched or parsed
     */
    private static fetchMetadata;
    /**
     * Resolves URLs, handling IPFS protocol and ID replacements
     * @param url - The URL to resolve (may contain {id} placeholder)
     * @param id - The asset ID to replace in the URL if needed
     * @returns The resolved URL with proper protocol
     */
    static resolveUrl(url: string, id: number): string;
    /**
     * Creates an Arc3 instance from an existing asset ID
     * @param id - The asset ID to load
     * @param network - The Algorand network to use
     * @returns A promise resolving to an Arc3 instance
     * @throws Error if the asset cannot be loaded
     */
    static fromId(id: number, network: Network): Promise<Arc3>;
    /**
     * Creates an Arc3 instance from existing asset parameters
     * @param id - The asset ID
     * @param assetParams - The asset parameters from the blockchain
     * @param network - The Algorand network to use
     * @returns A promise resolving to an Arc3 instance
     */
    static fromAssetParams(id: number, assetParams: AssetParams, network: Network): Promise<Arc3>;
    /**
     * Checks if the asset has a valid ARC-3 name
     * @param name - The asset name to validate
     * @returns True if the asset name is ARC-3 compliant
     */
    static hasValidName(name: string): boolean;
    /**
     * Checks if the asset has a valid ARC-3 URL
     * @param url - The asset URL to validate
     * @param id - The asset ID for URL resolution
     * @returns True if the asset URL is ARC-3 compliant
     */
    static hasValidUrl(url: string, id: number): boolean;
    /**
     * Checks if the asset is ARC-3 compliant
     * @param name - The asset name to check
     * @param url - The asset URL to check
     * @param id - The asset ID for URL resolution
     * @returns True if the asset is ARC-3 compliant
     */
    static isArc3(name: string, url: string, id: number): boolean;
    /**
     * Gets the metadata associated with the asset
     * @returns The metadata object
     */
    getMetadata(): any;
    /**
     * Gets the metadata URL for this ARC-3 asset
     * @returns The resolved metadata URL
     */
    getMetadataUrl(): string;
    /**
     * Gets the image URL associated with the asset
     * @returns The resolved image URL or empty string if no image
     */
    getImageUrl(): string;
    /**
     * Gets the image as a base64 encoded string
     * @returns A promise resolving to the base64 encoded image
     * @throws Error if no image is available or fetch fails
     */
    getImageBase64(): Promise<string>;
    /**
     * Creates a new ARC-3 compliant NFT on the Algorand blockchain
     * @param options - The configuration options for creating the ARC-3 NFT
     * @returns A promise resolving to an object containing the transaction ID and asset ID
     * @throws Error if creation fails
     */
    static create({ name, unitName, creator, ipfs, image, properties, network, defaultFrozen, manager, reserve, freeze, clawback, total, decimals, }: {
        /** The name of the asset */
        name: string;
        /** The unit name for the asset */
        unitName: string;
        /** The creator of the asset, including address and signer */
        creator: {
            address: string;
            signer: TransactionSigner;
        };
        /** The IPFS instance to use for uploading */
        ipfs: IPFS;
        /** The path to the image file */
        image: {
            file: string | File;
            name: string;
        };
        /** Additional properties to include in the metadata */
        properties: any;
        /** The Algorand network to use */
        network: Network;
        /** Whether the asset should be frozen by default */
        defaultFrozen?: boolean;
        /** The manager address */
        manager?: string;
        /** The reserve address */
        reserve?: string;
        /** The freeze address */
        freeze?: string;
        /** The clawback address */
        clawback?: string;
        /** The total number of assets */
        total?: number;
        /** The decimals for the asset */
        decimals?: number;
    }): Promise<{
        transactionId: string;
        assetId: number;
    }>;
    /**
     * Creates a new ARC-3 compliant NFT Transaction on the Algorand blockchain
     * @param options - The configuration options for creating the ARC-3 NFT Transaction
     * @returns A promise resolving to an algosdk.Transaction object
     * @throws Error if transaction creation fails
     */
    static makeAssetCreateTransaction({ name, unitName, creator, ipfs, image, properties, network, defaultFrozen, manager, reserve, freeze, clawback, total, decimals, }: {
        /** The name of the asset */
        name: string;
        /** The unit name for the asset */
        unitName: string;
        /** The creator of the asset, including address and signer */
        creator: {
            address: string;
            signer: TransactionSigner;
        };
        /** The IPFS instance to use for uploading */
        ipfs: IPFS;
        /** The path to the image file */
        image: {
            file: string | File;
            name: string;
        };
        /** Additional properties to include in the metadata */
        properties: any;
        /** The Algorand network to use */
        network: Network;
        /** Whether the asset should be frozen by default */
        defaultFrozen?: boolean;
        /** The manager address */
        manager?: string;
        /** The reserve address */
        reserve?: string;
        /** The freeze address */
        freeze?: string;
        /** The clawback address */
        clawback?: string;
        /** The total number of assets */
        total?: number;
        /** The decimals for the asset */
        decimals?: number;
    }): Promise<algosdk.Transaction>;
    /**
     * Calculates SHA256 hash of blob content
     * @param blobContent - The blob content to hash
     * @returns Promise resolving to hex-encoded hash string
     * @throws Error if no blob content provided
     * @private
     */
    private static calculateSHA256;
}
export { Arc3 };
