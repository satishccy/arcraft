/**
 * Implementation of the Algorand ARC-69 standard for NFTs with embedded metadata.
 * ARC-69 stores metadata directly in transaction notes instead of external URLs.
 * @module arc69
 */
import { AssetParams } from 'algosdk/dist/types/client/v2/algod/models/types';
import { CoreAsset } from './coreAsset';
import { Network } from './types';
import { TransactionSigner } from 'algosdk';
import { IPFS } from './ipfs';
/**
 * Class representing an ARC-69 compliant NFT on Algorand.
 * ARC-69 NFTs store metadata in transaction notes rather than external URLs.
 * Extends CoreAsset with metadata handling for the ARC-69 standard.
 */
export declare class Arc69 extends CoreAsset {
    /** The metadata associated with this ARC-69 asset, stored in transaction notes */
    metadata: any;
    /**
     * Creates an instance of Arc69.
     * @param id - The asset ID on the Algorand blockchain
     * @param params - The asset parameters from the Algorand blockchain
     * @param network - The Algorand network this asset exists on
     * @param metadata - The metadata associated with the asset (from transaction notes)
     */
    private constructor();
    /**
     * Fetches ARC-69 metadata from transaction notes for a given asset
     * @param assetId - The asset ID to fetch metadata for
     * @param network - The Algorand network to search on
     * @returns A promise resolving to the metadata object, or undefined if not found
     */
    private static fetchMetadata;
    /**
     * Resolves standard URLs, handling HTTP/HTTPS and IPFS protocols
     * @param url - The URL to resolve
     * @returns The resolved URL with proper protocol
     */
    private static resolveNormalUrl;
    /**
     * Public method to resolve URLs for ARC-69 assets
     * @param url - The URL to resolve
     * @returns The resolved URL
     */
    static resolveUrl(url: string): string;
    /**
     * Creates an Arc69 instance from an existing asset ID
     * @param id - The asset ID to load
     * @param network - The Algorand network to use
     * @returns A promise resolving to an Arc69 instance
     */
    static fromId(id: number, network: Network): Promise<Arc69>;
    /**
     * Creates an Arc69 instance from existing asset parameters
     * @param id - The asset ID
     * @param assetParams - The asset parameters from the blockchain
     * @param network - The Algorand network to use
     * @returns A promise resolving to an Arc69 instance
     */
    static fromAssetParams(id: number, assetParams: AssetParams, network: Network): Promise<Arc69>;
    /**
     * Checks if an asset has valid ARC-69 metadata in its transaction notes
     * @param assetId - The asset ID to check
     * @param network - The Algorand network to search on
     * @returns True if the asset has valid ARC-69 metadata
     */
    static hasValidMetadata(assetId: number, network: Network): Promise<boolean>;
    /**
     * Validates if a URL conforms to ARC-69 standards
     * @param url - The URL to validate
     * @returns True if the URL is valid for ARC-69
     */
    static hasValidUrl(url: string): boolean;
    /**
     * Determines if an asset is ARC-69 compliant
     * @param url - The asset URL to check
     * @param id - The asset ID
     * @param network - The Algorand network to check on
     * @returns True if the asset is ARC-69 compliant
     */
    static isArc69(url: string, id: number, network: Network): Promise<boolean>;
    /**
     * Gets the metadata associated with this ARC-69 asset
     * @returns The metadata object
     */
    getMetadata(): any;
    /**
     * Gets the resolved image URL for this ARC-69 asset
     * @returns The resolved image URL
     */
    getImageUrl(): string;
    /**
     * Gets the image as a base64 encoded string
     * @returns A promise resolving to the base64 encoded image
     */
    getImageBase64(): Promise<string>;
    /**
     * Creates a new ARC-69 compliant NFT on the Algorand blockchain
     * @param options - Configuration options for creating the ARC-69 NFT
     * @returns A promise resolving to an object containing the transaction ID and asset ID
     */
    static create({ name, unitName, creator, ipfs, image, properties, network, defaultFrozen, manager, reserve, freeze, clawback, total, decimals, }: {
        /** The name of the NFT */
        name: string;
        /** The unit name for the NFT */
        unitName: string;
        /** The creator account with address and transaction signer */
        creator: {
            address: string;
            signer: TransactionSigner;
        };
        /** IPFS instance for uploading the image */
        ipfs: IPFS;
        /** Image file and metadata */
        image: {
            file: string | File;
            name: string;
        };
        /** Additional properties for the NFT metadata */
        properties: any;
        /** The Algorand network to create the NFT on */
        network: Network;
        /** Whether the asset should be frozen by default */
        defaultFrozen?: boolean;
        /** The manager address for the asset */
        manager?: string;
        /** The reserve address for the asset */
        reserve?: string;
        /** The freeze address for the asset */
        freeze?: string;
        /** The clawback address for the asset */
        clawback?: string;
        /** The total number of units to create */
        total?: number;
        /** The number of decimal places for the asset */
        decimals?: number;
    }): Promise<{
        transactionId: string;
        assetId: number;
    }>;
    /**
     * Updates the metadata properties of an existing ARC-69 NFT
     * @param options - Configuration options for updating the NFT metadata
     * @returns A promise resolving to an object containing the transaction ID and confirmed round
     */
    static update: ({ manager, properties, assetId, network, }: {
        /** The manager account with address and transaction signer */
        manager: {
            address: string;
            signer: TransactionSigner;
        };
        /** The new properties to set in the metadata */
        properties: any;
        /** The asset ID of the NFT to update */
        assetId: number;
        /** The Algorand network the NFT exists on */
        network: Network;
    }) => Promise<{
        transactionId: string;
        confirmedRound: bigint | undefined;
    }>;
    /**
     * Retrieves all historical versions of metadata for an ARC-69 asset
     * @param assetId - The asset ID to get metadata versions for
     * @param network - The Algorand network to search on
     * @returns A promise resolving to an array of metadata objects
     */
    static getMetadataVersions: (assetId: number, network: Network) => Promise<Record<string, any>[]>;
    /**
     * Calculates the SHA256 hash of a file's content
     * @param blobContent - The file content as a Blob
     * @returns A promise resolving to the hex-encoded hash
     * @private
     */
    private static calculateSHA256;
}
