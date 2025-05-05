"use strict";
/**
 * IPFS integration module for handling file uploads to IPFS through various providers.
 * @module ipfs
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.IPFS = void 0;
const pinata_1 = require("./pinata");
/**
 * Class for handling IPFS file uploads through various providers
 */
class IPFS {
    /**
     * Creates an instance of the IPFS class
     * @param provider - The IPFS provider to use
     * @param config - Configuration for the selected provider
     */
    constructor(provider, config) {
        this.provider = provider;
        this.config = config;
    }
    /**
     * Uploads a file to IPFS
     * @param file - Path to the file to upload
     * @param fileName - Name to use for the file
     * @returns Promise resolving to the IPFS content identifier (CID)
     */
    async upload(file, fileName) {
        if (this.provider === 'pinata' && this.config.jwt) {
            const result = await (0, pinata_1.uploadToPinata)({
                file,
                name: fileName,
                token: this.config.jwt,
            });
            return result.IpfsHash;
        }
        else {
            throw new Error('Provider not supported');
        }
    }
    /**
     * Uploads a JSON object to IPFS
     * @param json - The JSON object to upload
     * @param fileName - Name to use for the file
     * @returns Promise resolving to the IPFS content identifier (CID)
     */
    async uploadJson(json, fileName) {
        if (this.provider === 'pinata' && this.config.jwt) {
            const result = await (0, pinata_1.uploadJsonToPinata)({
                json,
                name: fileName,
                token: this.config.jwt,
            });
            return result.IpfsHash;
        }
        else {
            throw new Error('Provider not supported');
        }
    }
}
exports.IPFS = IPFS;
//# sourceMappingURL=ipfs.js.map