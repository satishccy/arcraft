/**
 * IPFS integration module for handling file uploads to IPFS through various providers.
 * Supports both Node.js and browser environments.
 * @module ipfs
 */
/** Supported IPFS providers */
export type providers = 'pinata' | 'filebase';
/** Configuration for Pinata IPFS provider */
export type PinataConfig = {
    /** Provider identifier, must be 'pinata' */
    provider: 'pinata';
    /** JWT token for Pinata authentication */
    jwt: string;
};
/** Configuration for Filebase IPFS provider */
export type FilebaseConfig = {
    /** Provider identifier, must be 'filebase' */
    provider: 'filebase';
    /** API token for Filebase authentication */
    token: string;
};
/** Union type for all supported provider configurations */
export type ProviderConfig = PinataConfig | FilebaseConfig;
/**
 * Class for handling IPFS file uploads through various providers
 */
export declare class IPFS {
    private provider;
    private config;
    /**
     * Creates an instance of the IPFS class
     * @param provider - The IPFS provider to use ('pinata' or 'filebase')
     * @param config - Configuration for the selected provider
     */
    constructor(provider: providers, config: ProviderConfig);
    /**
     * Uploads a file to IPFS (Node.js version - accepts file path)
     * @param file - Path to the file to upload
     * @param fileName - Name to use for the file
     * @returns Promise resolving to the IPFS content identifier (CID)
     * @throws Error if provider is not supported or upload fails
     */
    upload(file: string, fileName?: string): Promise<string>;
    /**
     * Uploads a file to IPFS (Browser version - accepts File object)
     * @param file - File object to upload
     * @param fileName - Name to use for the file (optional, will use file.name if not provided)
     * @returns Promise resolving to the IPFS content identifier (CID)
     * @throws Error if provider is not supported or upload fails
     */
    upload(file: File, fileName?: string): Promise<string>;
    /**
     * Uploads a JSON object to IPFS
     * Supports multiple providers: Pinata and Filebase
     * @param json - The JSON object to upload
     * @param fileName - Name to use for the file
     * @returns Promise resolving to the IPFS content identifier (CID)
     * @throws Error if provider is not supported or upload fails
     */
    uploadJson(json: object, fileName: string): Promise<string>;
}
