/**
 * Configuration options for uploading files to Pinata
 */
export interface PinataUploadOptions {
    /**
     * The file path to upload
     */
    file: string;
    /**
     * Name for the file in Pinata
     */
    name: string;
    /**
     * Pinata API JWT token for authentication
     */
    token: string;
}
/**
 * Response object returned by Pinata API after a successful upload
 */
export interface PinataResponse {
    /**
     * IPFS content identifier (CID) of the uploaded file
     */
    IpfsHash: string;
    /**
     * Size of the pinned content in bytes
     */
    PinSize: number;
    /**
     * Timestamp of when the file was pinned
     */
    Timestamp: string;
    /**
     * Indicates if the file was already pinned previously
     */
    isDuplicate?: boolean;
}
/**
 * Uploads a file to Pinata IPFS service
 * @param options - Upload configuration options
 * @returns Promise resolving to the Pinata API response with IPFS hash
 * @throws Error if upload fails
 */
declare function uploadToPinata({ file, name, token, }: PinataUploadOptions): Promise<PinataResponse>;
/**
 * Configuration options for uploading JSON objects to Pinata
 */
export interface PinataJsonUploadOptions {
    /**
     * The JSON object to upload
     */
    json: object;
    /**
     * Name for the JSON file in Pinata
     */
    name: string;
    /**
     * Pinata API JWT token for authentication
     */
    token: string;
}
/**
 * Uploads a JSON object to Pinata IPFS service
 * @param options - JSON upload configuration options
 * @returns Promise resolving to the Pinata API response with IPFS hash
 * @throws Error if upload fails
 */
declare function uploadJsonToPinata({ json, name, token, }: PinataJsonUploadOptions): Promise<PinataResponse>;
export { uploadToPinata, uploadJsonToPinata };
