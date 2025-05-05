/* eslint-disable import/no-unresolved */
import { ALGORAND_ZERO_ADDRESS_STRING } from 'algosdk';
import { getAlgodClient } from './utils';
export class CoreAsset {
    constructor(id, assetParams) {
        this.id = id;
        this.assetParams = assetParams;
    }
    static async fromId(id, network) {
        const assetParams = await this.fetchAssetParams(id, network);
        return new CoreAsset(id, assetParams);
    }
    static async fetchAssetParams(id, network) {
        const client = getAlgodClient(network);
        const asset = await client.getAssetByID(id).do();
        return asset.params;
    }
    get() {
        return this.assetParams;
    }
    getCreator() {
        return this.assetParams.creator;
    }
    getClawback() {
        return this.assetParams.clawback ?? ALGORAND_ZERO_ADDRESS_STRING;
    }
    getFreeze() {
        return this.assetParams.freeze ?? ALGORAND_ZERO_ADDRESS_STRING;
    }
    getReserve() {
        return this.assetParams.reserve ?? ALGORAND_ZERO_ADDRESS_STRING;
    }
    getManager() {
        return this.assetParams.manager ?? ALGORAND_ZERO_ADDRESS_STRING;
    }
    hasClawback() {
        return this.assetParams.clawback !== ALGORAND_ZERO_ADDRESS_STRING;
    }
    hasFreeze() {
        return this.assetParams.freeze !== ALGORAND_ZERO_ADDRESS_STRING;
    }
    hasReserve() {
        return this.assetParams.reserve !== ALGORAND_ZERO_ADDRESS_STRING;
    }
    hasManager() {
        return this.assetParams.manager !== ALGORAND_ZERO_ADDRESS_STRING;
    }
    getIndex() {
        return this.id;
    }
    getName() {
        return this.assetParams.name ?? '';
    }
    getUnitName() {
        return this.assetParams.unitName ?? '';
    }
    getDecimals() {
        return this.assetParams.decimals;
    }
    getTotal() {
        return Number(this.assetParams.total);
    }
    getTotalSupply() {
        return this.getTotal() / 10 ** this.getDecimals();
    }
    getAmountInDecimals(amount) {
        return amount / 10 ** this.getDecimals();
    }
    getAmountInBaseUnits(amount) {
        return amount * 10 ** this.getDecimals();
    }
    getDefaultFrozen() {
        return this.assetParams.defaultFrozen ?? false;
    }
    getUrl() {
        return this.assetParams.url ?? '';
    }
    getMetadataHash() {
        const textDecoder = new TextDecoder();
        return textDecoder.decode(this.assetParams.metadataHash ?? new Uint8Array());
    }
    getUrlProtocol() {
        const url = this.getUrl();
        if (!url)
            return '';
        const [protocol] = url.split('://');
        return protocol || '';
    }
    hasHttpUrl() {
        return (this.getUrlProtocol() === 'http' || this.getUrlProtocol() === 'https');
    }
    hasIpfsUrl() {
        return this.getUrlProtocol() === 'ipfs';
    }
    hasTemplateUrl() {
        return this.getUrlProtocol() === 'template-ipfs';
    }
}
//# sourceMappingURL=coreAsset.js.map