/**
 * IPFS integration module for handling file uploads to IPFS through various providers.
 * Supports both Node.js and browser environments.
 * @module ipfs
 */
import { uploadJsonToPinata, uploadToPinata } from './pinata';
import { uploadJsonToFilebase, uploadToFilebase } from './filebase';
/**
 * Class for handling IPFS file uploads through various providers
 */
export class IPFS {
    /**
     * Creates an instance of the IPFS class
     * @param provider - The IPFS provider to use ('pinata' or 'filebase')
     * @param config - Configuration for the selected provider
     */
    constructor(provider, config) {
        this.provider = provider;
        this.config = config;
    }
    /**
     * Uploads a file to IPFS (Universal implementation)
     * Supports multiple providers: Pinata and Filebase
     * @param file - File path (Node.js) or File object (Browser)
     * @param fileName - Name to use for the file
     * @returns Promise resolving to the IPFS content identifier (CID)
     * @throws Error if provider is not supported or upload fails
     */
    async upload(file, fileName) {
        if (this.provider === 'pinata' && this.config.provider === 'pinata') {
            if (typeof file === 'string') {
                // Node.js environment - file is a path
                const result = await uploadToPinata({
                    file,
                    name: fileName,
                    token: this.config.jwt,
                });
                return result.IpfsHash;
            }
            else {
                // Browser environment - file is a File object
                const result = await uploadToPinata({
                    file,
                    name: fileName,
                    token: this.config.jwt,
                });
                return result.IpfsHash;
            }
        }
        else if (this.provider === 'filebase' &&
            this.config.provider === 'filebase') {
            if (typeof file === 'string') {
                // Node.js environment - file is a path
                const result = await uploadToFilebase({
                    file,
                    name: fileName,
                    token: this.config.token,
                });
                return result.cid;
            }
            else {
                // Browser environment - file is a File object
                const result = await uploadToFilebase({
                    file,
                    name: fileName,
                    token: this.config.token,
                });
                return result.cid;
            }
        }
        else {
            throw new Error(`Provider '${this.provider}' not supported or configuration mismatch`);
        }
    }
    /**
     * Uploads a JSON object to IPFS
     * Supports multiple providers: Pinata and Filebase
     * @param json - The JSON object to upload
     * @param fileName - Name to use for the file
     * @returns Promise resolving to the IPFS content identifier (CID)
     * @throws Error if provider is not supported or upload fails
     */
    async uploadJson(json, fileName) {
        if (this.provider === 'pinata' && this.config.provider === 'pinata') {
            const result = await uploadJsonToPinata({
                json,
                name: fileName,
                token: this.config.jwt,
            });
            return result.IpfsHash;
        }
        else if (this.provider === 'filebase' &&
            this.config.provider === 'filebase') {
            const result = await uploadJsonToFilebase({
                json,
                name: fileName,
                token: this.config.token,
            });
            return result.cid;
        }
        else {
            throw new Error(`Provider '${this.provider}' not supported or configuration mismatch`);
        }
    }
}
//# sourceMappingURL=ipfs.js.map