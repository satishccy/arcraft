import { uploadJsonToPinata, uploadToPinata } from './pinata';
export class IPFS {
    constructor(provider, config) {
        this.provider = provider;
        this.config = config;
    }
    async upload(file, fileName) {
        if (this.provider === 'pinata' && this.config.jwt) {
            const result = await uploadToPinata({
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
            const result = await uploadJsonToPinata({
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
//# sourceMappingURL=ipfs.js.map