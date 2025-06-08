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
     * @param metadata - The metadata associated with the asset
     */
    private constructor();
    static resolveUrl(url: string, reserveAddr: string): string;
    /**
     * Creates an Arc19 instance from an existing asset ID
     * @param id - The asset ID to load
     * @param network - The Algorand network to use
     * @returns A promise resolving to an Arc19 instance
     */
    static fromId(id: number, network: Network): Promise<Arc19>;
    static fromAssetParams(id: number, assetParams: AssetParams, network: Network): Promise<Arc19>;
    static hasValidUrl(url: string): boolean;
    static isArc19(url: string): boolean;
    private static calculateSHA256;
    /**
     * Converts a codec code to its string representation
     * @param code - The numeric codec code
     * @returns The codec string representation
     * @private
     */
    private static codeToCodec;
    /**
     * Creates a reserve address and asset URL from an IPFS CID
     * @param ipfsCid - The IPFS content identifier
     * @returns An object containing the asset URL and reserve address
     * @private
     */
    private static createReserveAddressFromIpfsCid;
    /**
     * Resolves standard URLs, handling HTTP/HTTPS and IPFS protocols
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
     * Gets the resolved image URL for this ARC-19 asset
     * @returns The resolved image URL
     */
    getImageUrl(): string;
    /**
     * Gets the image as a base64 encoded string
     * @returns A promise resolving to the base64 encoded image
     */
    getImageBase64(): Promise<string>;
    /**
     * Creates a new ARC-19 compliant NFT on the Algorand blockchain
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
     * Updates the metadata and/or image of an existing ARC-19 NFT
     * @param options - Configuration options for updating the NFT
     * @returns A promise resolving to an object with status and transaction details
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
        status: boolean;
        confirmedRound: bigint | undefined;
        transactionId: string;
        err?: undefined;
    } | {
        status: boolean;
        err: unknown;
        confirmedRound?: undefined;
        transactionId?: undefined;
    }>;
    /**
     * Retrieves all historical versions of metadata for an ARC-19 asset
     * @param assetId - The asset ID to get metadata versions for
     * @param network - The Algorand network to search on
     * @returns A promise resolving to an array of metadata objects with round numbers
     */
    static getMetadataVersions: (assetId: number, network: Network) => Promise<Record<string, any>[]>;
    /**
     * Gets the metadata URL for this ARC-19 asset by resolving the template-ipfs URL
     * @returns The resolved metadata URL
     */
    getMetadataUrl(): string;
}
