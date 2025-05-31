/**
 * Implementation of the Algorand ARC-19 standard for NFTs.
 * @module arc19
 */
import { TransactionSigner } from "algosdk";
import { IPFS } from "./ipfs";
import { CoreAsset } from "./coreAsset";
import { Network } from "./types";
/**
 * Class representing an ARC-19 compliant NFT on Algorand.
 * Extends CoreAsset with metadata handling for the ARC-19 standard.
 */
export declare class Arc19 extends CoreAsset {
    /** The metadata associated with this ARC-19 asset */
    metadata: object;
    /**
     * Creates an instance of Arc19.
     * @param id - The asset ID
     * @param params - The asset parameters from the Algorand blockchain
     * @param metadata - The metadata associated with the asset
     */
    private constructor();
    private static resolveProtocol;
    private static calculateSHA256;
    private static codeToCodec;
    private static createReserveAddressFromIpfsCid;
    /**
     * Creates a new ARC-19 compliant NFT on the Algorand blockchain
     */
    static createNFT: (path: string, filename: string, ipfs: IPFS, creator: {
        address: string;
        signer: TransactionSigner;
    }, name: string, unitName: string, properties: any, hasClawback: boolean, network: Network) => Promise<{
        transactionId: string;
        assetId: number;
    }>;
    static createNFTwithImageCID(params: {
        path: string;
        filename: string;
        image_cid: string;
        ipfs: IPFS;
        creator: {
            address: string;
            signer: TransactionSigner;
        };
        name: string;
        unitName: string;
        manager?: string;
        freeze?: string;
        clawback?: string;
        properties?: any;
        network: Network;
    }): Promise<{
        transactionId: string;
        assetId: number;
    }>;
    static updateMetadataProperties: (manager: {
        address: string;
        signer: TransactionSigner;
    }, updatedProperties: any, assetId: number, ipfs: IPFS, network: Network, ipfsHash?: string, filename?: string, path?: string) => Promise<{
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
    static getMetadataVersions: (assetId: number, network: Network) => Promise<Record<number, any>[]>;
    /**
     * Creates an Arc19 instance from an existing asset ID
     * @param id - The asset ID to load
     * @param network - The Algorand network to use
     * @returns A promise resolving to an Arc19 instance
     */
    static fromId(id: number, network: Network): Promise<Arc19>;
    hasValidUrl(): boolean;
    getMetadataUrl(): string;
    getMetadata(): Promise<any>;
    validate(): Promise<{
        valid: boolean;
        error: string;
    }>;
}
