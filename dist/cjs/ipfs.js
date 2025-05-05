"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IPFS = void 0;
const pinata_1 = require("./pinata");
class IPFS {
    constructor(provider, config) {
        this.provider = provider;
        this.config = config;
    }
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