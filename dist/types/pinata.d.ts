/// <reference types="node" />
/// <reference types="node" />
interface PinataUploadOptions {
    /**
     * The file to upload - can be:
     * - A path to a file (string)
     * - A buffer containing file data
     */
    file: string | Buffer;
    /** Name for the file */
    name: string;
    /** Pinata API token */
    token: string;
}
interface PinataResponse {
    IpfsHash: string;
    PinSize: number;
    Timestamp: string;
    isDuplicate?: boolean;
}
/**
 * Uploads a file to Pinata cloud storage
 * @param options Upload configuration options
 * @returns Promise resolving to the Pinata API response
 */
declare function uploadToPinata({ file, name, token, }: PinataUploadOptions): Promise<PinataResponse>;
interface PinataJsonUploadOptions {
    json: object;
    name: string;
    token: string;
}
declare function uploadJsonToPinata({ json, name, token, }: PinataJsonUploadOptions): Promise<PinataResponse>;
export { uploadToPinata, uploadJsonToPinata };
