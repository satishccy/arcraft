import { CoreAsset } from './coreAsset';
import { IPFS_GATEWAY } from './const';
import algosdk from 'algosdk';
import mime from 'mime-types';
import crypto from 'crypto';
import { getAlgodClient } from './utils';
import fs from 'fs';
class Arc3 extends CoreAsset {
    constructor(id, params, metadata) {
        super(id, params);
        this.metadata = metadata;
    }
    static async fetchMetadata(url) {
        try {
            const metadataResponse = await fetch(url);
            return metadataResponse.json();
        }
        catch (error) {
            return {};
        }
    }
    static resolveUrl(url, id) {
        let resolvedUrl = url;
        if (url.includes('{id}')) {
            resolvedUrl = url.replace('{id}', id.toString());
        }
        if (resolvedUrl.startsWith('https://')) {
            return resolvedUrl;
        }
        else if (resolvedUrl.startsWith('ipfs://')) {
            return `${IPFS_GATEWAY}${resolvedUrl.slice(7)}`;
        }
        else {
            return '';
        }
    }
    static async fromId(id, network) {
        const asset = await CoreAsset.fromId(id, network);
        const resolvedUrl = this.resolveUrl(asset.getUrl(), id);
        const metadata = await this.fetchMetadata(resolvedUrl);
        return new Arc3(id, asset.assetParams, metadata);
    }
    hasValidName() {
        if (!this.assetParams.name) {
            return false;
        }
        if (this.assetParams.name.toLowerCase() == 'arc3') {
            return true;
        }
        else if (this.assetParams.name.toLowerCase().endsWith('arc3')) {
            return true;
        }
        return false;
    }
    hasValidUrl() {
        if (!this.assetParams.url) {
            return false;
        }
        const url = Arc3.resolveUrl(this.assetParams.url, this.id);
        if (url.toLowerCase().endsWith('#arc3')) {
            return true;
        }
        return false;
    }
    isArc3() {
        return this.hasValidName() || this.hasValidUrl();
    }
    getMetadata() {
        return this.metadata;
    }
    static async create({ name, unitName, creator, ipfs, image, imageName, properties, network, defaultFrozen = false, manager = undefined, reserve = undefined, freeze = undefined, clawback = undefined, }) {
        const imageCid = await ipfs.upload(image, imageName);
        const mimeType = mime.lookup(imageName) || 'application/octet-stream';
        let blob = new Blob([await fs.promises.readFile(image)], {
            type: mimeType,
        });
        const imageHash = await this.calculateSHA256(blob);
        const metadata = {
            name: name,
            unit_name: unitName,
            creator: creator.address,
            image: `ipfs://${imageCid}#arc3`,
            image_integrity: `sha256-${imageHash}`,
            image_mimetype: mimeType,
            properties: properties,
        };
        const metadataCid = await ipfs.uploadJson(metadata, 'metadata.json');
        const client = getAlgodClient(network);
        const sp = await client.getTransactionParams().do();
        const nft_txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
            sender: creator.address,
            suggestedParams: sp,
            defaultFrozen: defaultFrozen,
            unitName: unitName,
            assetName: name,
            manager: manager,
            reserve: reserve,
            freeze: freeze,
            clawback: clawback,
            assetURL: `ipfs://${metadataCid}#arc3`,
            total: 1,
            decimals: 0,
        });
        const signed = await creator.signer([nft_txn], [0]);
        const txid = await client.sendRawTransaction(signed[0]).do();
        const result = await algosdk.waitForConfirmation(client, txid.txid, 3);
        return { txid: txid.txid, assetId: result.assetIndex };
    }
    static async calculateSHA256(blobContent) {
        if (!blobContent) {
            throw Error('No Blob found in calculateSHA256');
        }
        try {
            var buffer = Buffer.from(await blobContent.arrayBuffer());
            const hash = crypto.createHash('sha256');
            hash.update(buffer);
            return hash.digest('hex');
        }
        catch (error) {
            throw error;
        }
    }
}
export { Arc3 };
//# sourceMappingURL=arc3.js.map