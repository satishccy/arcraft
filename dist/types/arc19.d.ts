/**
 * Implementation of the Algorand ARC-19 standard for NFTs.
 * @module arc19
 */
import { TransactionSigner } from 'algosdk';
import { AssetParams } from 'algosdk/dist/types/client/v2/algod/models/types';
import { IPFS } from './ipfs';
import { CoreAsset } from './coreAsset';
import { Network } from './types';
/**
 * Class representing an ARC-19 compliant NFT on Algorand.
 * Extends CoreAsset with metadata handling for the ARC-19 standard.
 */
export declare class Arc19 extends CoreAsset {
    /** The metadata associated with this ARC-19 asset */
    metadata: any;
    /**
     * Creates an instance of Arc19.
     * @param id - The asset ID
     * @param params - The asset parameters from the Algorand blockchain
     * @param network - The Algorand network this asset exists on
     * @param metadata - The metadata associated with the asset
     */
    private constructor();
    /**
     * Resolves template-ipfs URLs to standard IPFS URLs using reserve address
     * Handles the ARC-19 template format: template-ipfs://{ipfscid:1:raw:reserve:sha2-256}
     * @param url - The template-ipfs URL to resolve
     * @param reserveAddr - The reserve address to use for CID generation
     * @returns The resolved IPFS URL or empty string if invalid
     */
    static resolveUrl(url: string, reserveAddr: string): string;
    /**
     * Creates an Arc19 instance from an existing asset ID
     * @param id - The asset ID to load
     * @param network - The Algorand network to use
     * @returns A promise resolving to an Arc19 instance
     * @throws Error if the asset cannot be loaded
     */
    static fromId(id: number, network: Network): Promise<Arc19>;
    /**
     * Creates an Arc19 instance from existing asset parameters
     * @param id - The asset ID
     * @param assetParams - The asset parameters from the blockchain
     * @param network - The Algorand network to use
     * @returns A promise resolving to an Arc19 instance
     */
    static fromAssetParams(id: number, assetParams: AssetParams, network: Network): Promise<Arc19>;
    /**
     * Validates if a URL conforms to ARC-19 template-ipfs format
     * @param url - The URL to validate
     * @returns True if the URL is valid ARC-19 template format
     */
    static hasValidUrl(url: string): boolean;
    /**
     * Checks if an asset is ARC-19 compliant based on its URL
     * @param url - The asset URL to check
     * @returns True if the asset follows ARC-19 standards
     */
    static isArc19(url: string): boolean;
    /**
     * Calculates SHA256 hash of blob content
     * @param blobContent - The blob content to hash
     * @returns Promise resolving to hex-encoded hash string
     * @throws Error if no blob content provided
     * @private
     */
    private static calculateSHA256;
    /**
     * Converts numeric codec code to string representation
     * @param code - The numeric codec code
     * @returns The string representation of the codec
     * @private
     */
    private static codeToCodec;
    /**
     * Creates a reserve address from an IPFS CID for ARC-19 template resolution
     * @param ipfsCid - The IPFS CID to convert
     * @returns The Algorand address derived from the CID
     * @private
     */
    private static createReserveAddressFromIpfsCid;
    /**
     * Resolves standard URLs (HTTP/HTTPS and IPFS)
     * @param url - The URL to resolve
     * @returns The resolved URL with proper protocol
     * @private
     */
    private static resolveNormalUrl;
    /**
     * Gets the metadata associated with this ARC-19 asset
     * @returns The metadata object
     */
    getMetadata(): any;
    /**
     * Gets the image URL for this ARC-19 asset
     * @returns The resolved image URL
     */
    getImageUrl(): string;
    /**
     * Gets the image as a base64 encoded string
     * @returns A promise resolving to the base64 encoded image
     * @throws Error if no image is available or fetch fails
     */
    getImageBase64(): Promise<string>;
    /**
     * Creates a new ARC-19 compliant NFT on the Algorand blockchain
     * @param options - The configuration options for creating the ARC-19 NFT
     * @returns A promise resolving to an object containing the transaction ID and asset ID
     * @throws Error if creation fails
     */
    static create: ({ name, unitName, creator, ipfs, image, properties, network, defaultFrozen, manager, freeze, clawback, total, decimals, }: {
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
        /** The freeze address */
        freeze?: string;
        /** The clawback address */
        clawback?: string;
        /** The total number of assets */
        total?: number;
        /** The decimals for the asset */
        decimals?: number;
    }) => Promise<{
        transactionId: string;
        assetId: number;
    }>;
    /**
     * Updates an existing ARC-19 NFT's metadata
     * @param options - The configuration options for updating the ARC-19 NFT
     * @returns A promise resolving to the transaction confirmation
     * @throws Error if update fails or manager doesn't have permission
     */
    static update: ({ manager, properties, image, assetId, ipfs, network, }: {
        /** The manager account with address and transaction signer */
        manager: {
            address: string;
            signer: TransactionSigner;
        };
        /** The new properties to set in the metadata */
        properties?: any;
        /** The new image to upload and set */
        image?: {
            file: string | File;
            name: string;
        };
        /** The asset ID of the NFT to update */
        assetId: number;
        /** IPFS instance for uploading content */
        ipfs: IPFS;
        /** The Algorand network the NFT exists on */
        network: Network;
    }) => Promise<{
        confirmedRound: bigint | undefined;
        transactionId: string;
    }>;
    /**
     * Gets all metadata versions for an ARC-19 asset by examining transaction history
     * @param assetId - The asset ID to get metadata versions for
     * @param network - The Algorand network to search on
     * @returns Promise resolving to array of metadata versions with timestamps
     * @throws Error if unable to fetch transaction history
     */
    static getMetadataVersions: (assetId: number, network: Network) => Promise<Record<string, any>[]>;
    /**
     * Gets the metadata URL for this ARC-19 asset using the reserve address
     * @returns The resolved metadata URL
     */
    getMetadataUrl(): string;
}
