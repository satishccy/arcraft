/**
 * IPFS integration module for handling file uploads to IPFS through various providers.
 * @module ipfs
 */
/** Supported IPFS providers */
export type providers = 'pinata';
/** Configuration for Pinata IPFS provider */
export type PinataConfig = {
    /** Provider identifier, must be 'pinata' */
    provider: 'pinata';
    /** JWT token for Pinata authentication */
    jwt: string;
};
/**
 * Class for handling IPFS file uploads through various providers
 */
export declare class IPFS {
    private provider;
    private config;
    /**
     * Creates an instance of the IPFS class
     * @param provider - The IPFS provider to use
     * @param config - Configuration for the selected provider
     */
    constructor(provider: providers, config: PinataConfig);
    /**
     * Uploads a file to IPFS
     * @param file - Path to the file to upload
     * @param fileName - Name to use for the file
     * @returns Promise resolving to the IPFS content identifier (CID)
     */
    upload(file: string, fileName: string): Promise<string>;
    /**
     * Uploads a JSON object to IPFS
     * @param json - The JSON object to upload
     * @param fileName - Name to use for the file
     * @returns Promise resolving to the IPFS content identifier (CID)
     */
    uploadJson(json: object, fileName: string): Promise<string>;
}
