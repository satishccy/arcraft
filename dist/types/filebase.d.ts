/**
 * Configuration options for uploading files to Filebase (Node.js)
 */
export interface FilebaseUploadOptionsNode {
    /**
     * The file path to upload
     */
    file: string;
    /**
     * Name for the file in Filebase
     */
    name?: string;
    /**
     * Filebase API token for authentication
     */
    token: string;
}
/**
 * Configuration options for uploading files to Filebase (Browser)
 */
export interface FilebaseUploadOptionsBrowser {
    /**
     * The File object to upload (from HTML input or drag-drop)
     */
    file: File;
    /**
     * Name for the file in Filebase (optional, will use file.name if not provided)
     */
    name?: string;
    /**
     * Filebase API token for authentication
     */
    token: string;
}
/**
 * Configuration options for uploading files to Filebase (Universal)
 */
export type FilebaseUploadOptions = FilebaseUploadOptionsNode | FilebaseUploadOptionsBrowser;
/**
 * Response object returned by Filebase API after a successful upload
 */
export interface FilebaseResponse {
    /**
     * IPFS content identifier (CID) of the uploaded file
     */
    cid: string;
    /**
     * Name of the uploaded file
     */
    name: string;
    /**
     * Size of the uploaded content in bytes
     */
    size: number;
    /**
     * Additional metadata about the upload
     */
    metadata?: Record<string, any>;
}
/**
 * Uploads a file to Filebase IPFS service (Universal function)
 * Automatically detects environment and uses appropriate upload method
 * @param options - Upload configuration options
 * @returns Promise resolving to the Filebase API response with IPFS hash
 * @throws Error if upload fails
 */
declare function uploadToFilebase(options: FilebaseUploadOptions): Promise<FilebaseResponse>;
/**
 * Configuration options for uploading JSON objects to Filebase
 */
export interface FilebaseJsonUploadOptions {
    /**
     * The JSON object to upload
     */
    json: object;
    /**
     * Name for the JSON file in Filebase
     */
    name: string;
    /**
     * Filebase API token for authentication
     */
    token: string;
}
/**
 * Uploads a JSON object to Filebase IPFS service
 * @param options - JSON upload configuration options
 * @returns Promise resolving to the Filebase API response with IPFS hash
 * @throws Error if upload fails
 */
declare function uploadJsonToFilebase({ json, name, token, }: FilebaseJsonUploadOptions): Promise<FilebaseResponse>;
export { uploadToFilebase, uploadJsonToFilebase };
