/**
 * Configuration options for uploading files to Pinata (Node.js)
 */
export interface PinataUploadOptionsNode {
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
 * Configuration options for uploading files to Pinata (Browser)
 */
export interface PinataUploadOptionsBrowser {
    /**
     * The File object to upload (from HTML input or drag-drop)
     */
    file: File;
    /**
     * Name for the file in Pinata (optional, will use file.name if not provided)
     */
    name?: string;
    /**
     * Pinata API JWT token for authentication
     */
    token: string;
}
/**
 * Configuration options for uploading files to Pinata (Universal)
 */
export type PinataUploadOptions = PinataUploadOptionsNode | PinataUploadOptionsBrowser;
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
 * Uploads a file to Pinata IPFS service (Universal function)
 * @param options - Upload configuration options
 * @returns Promise resolving to the Pinata API response with IPFS hash
 * @throws Error if upload fails
 */
declare function uploadToPinata(options: PinataUploadOptions): Promise<PinataResponse>;
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
