"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreAsset = void 0;
/* eslint-disable import/no-unresolved */
const algosdk_1 = require("algosdk");
const utils_1 = require("./utils");
class CoreAsset {
    constructor(id, assetParams) {
        this.id = id;
        this.assetParams = assetParams;
    }
    static async fromId(id, network) {
        const assetParams = await this.fetchAssetParams(id, network);
        return new CoreAsset(id, assetParams);
    }
    static async fetchAssetParams(id, network) {
        const client = (0, utils_1.getAlgodClient)(network);
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
        return this.assetParams.clawback ?? algosdk_1.ALGORAND_ZERO_ADDRESS_STRING;
    }
    getFreeze() {
        return this.assetParams.freeze ?? algosdk_1.ALGORAND_ZERO_ADDRESS_STRING;
    }
    getReserve() {
        return this.assetParams.reserve ?? algosdk_1.ALGORAND_ZERO_ADDRESS_STRING;
    }
    getManager() {
        return this.assetParams.manager ?? algosdk_1.ALGORAND_ZERO_ADDRESS_STRING;
    }
    hasClawback() {
        return this.assetParams.clawback !== algosdk_1.ALGORAND_ZERO_ADDRESS_STRING;
    }
    hasFreeze() {
        return this.assetParams.freeze !== algosdk_1.ALGORAND_ZERO_ADDRESS_STRING;
    }
    hasReserve() {
        return this.assetParams.reserve !== algosdk_1.ALGORAND_ZERO_ADDRESS_STRING;
    }
    hasManager() {
        return this.assetParams.manager !== algosdk_1.ALGORAND_ZERO_ADDRESS_STRING;
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
exports.CoreAsset = CoreAsset;
//# sourceMappingURL=coreAsset.js.map