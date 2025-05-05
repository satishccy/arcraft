/**
 * Implementation of the Algorand ARC-3 standard for NFTs.
 * @module arc3
 */
import { CoreAsset } from './coreAsset';
import { Network } from './types';
import { TransactionSigner } from 'algosdk';
import { IPFS } from './ipfs';
/**
 * Class representing an ARC-3 compliant NFT on Algorand.
 * Extends CoreAsset with metadata handling for the ARC-3 standard.
 */
declare class Arc3 extends CoreAsset {
    /** The metadata associated with this ARC-3 asset */
    metadata: object;
    /**
     * Creates an instance of Arc3.
     * @param id - The asset ID
     * @param params - The asset parameters from the Algorand blockchain
     * @param metadata - The metadata associated with the asset
     */
    private constructor();
    /**
     * Fetches metadata from a given URL
     * @param url - The URL to fetch metadata from
     * @returns A promise resolving to the metadata object
     */
    protected static fetchMetadata(url: string): Promise<object>;
    /**
     * Resolves URLs, handling IPFS protocol and ID replacements
     * @param url - The URL to resolve
     * @param id - The asset ID to replace in the URL if needed
     * @returns The resolved URL
     */
    static resolveUrl(url: string, id: number): string;
    /**
     * Creates an Arc3 instance from an existing asset ID
     * @param id - The asset ID to load
     * @param network - The Algorand network to use
     * @returns A promise resolving to an Arc3 instance
     */
    static fromId(id: number, network: Network): Promise<Arc3>;
    /**
     * Checks if the asset has a valid ARC-3 name
     * @returns True if the asset name is ARC-3 compliant
     */
    hasValidName(): boolean;
    /**
     * Checks if the asset has a valid ARC-3 URL
     * @returns True if the asset URL is ARC-3 compliant
     */
    hasValidUrl(): boolean;
    /**
     * Checks if the asset is ARC-3 compliant
     * @returns True if the asset is ARC-3 compliant
     */
    isArc3(): boolean;
    /**
     * Gets the metadata associated with the asset
     * @returns The metadata object
     */
    getMetadata(): object;
    /**
     * Creates a new ARC-3 compliant NFT on the Algorand blockchain
     * @param options - The configuration options for the NFT
     * @returns A promise resolving to an object containing the transaction ID and asset ID
     */
    static create({ name, unitName, creator, ipfs, image, imageName, properties, network, defaultFrozen, manager, reserve, freeze, clawback, }: {
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
        image: string;
        /** The name of the image file */
        imageName: string;
        /** Additional properties to include in the metadata */
        properties: object;
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
    }): Promise<{
        txid: string;
        assetId: bigint | undefined;
    }>;
    /**
     * Calculates the SHA256 hash of a file's content
     * @param blobContent - The file content as a Blob
     * @returns A promise resolving to the hex-encoded hash
     * @private
     */
    private static calculateSHA256;
}
export { Arc3 };
