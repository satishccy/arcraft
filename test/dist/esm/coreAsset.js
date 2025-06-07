/**
 * Core Algorand Asset module providing base functionality for working with Algorand Standard Assets.
 * @module coreAsset
 */
/* eslint-disable import/no-unresolved */
import { ALGORAND_ZERO_ADDRESS_STRING } from 'algosdk';
import { getAlgodClient } from './utils';
/**
 * Base class for working with Algorand Standard Assets (ASAs)
 * Provides core functionality for interacting with assets on the Algorand blockchain
 */
export class CoreAsset {
    /**
     * Creates an instance of CoreAsset
     * @param id - The asset ID
     * @param assetParams - The asset parameters
     */
    constructor(id, assetParams) {
        this.id = id;
        this.assetParams = assetParams;
    }
    /**
     * Creates a CoreAsset instance from an asset ID
     * @param id - The asset ID to load
     * @param network - The Algorand network to use
     * @returns A promise resolving to a CoreAsset instance
     */
    static async fromId(id, network) {
        const assetParams = await this.fetchAssetParams(id, network);
        return new CoreAsset(id, assetParams);
    }
    /**
     * Fetches asset parameters from the Algorand blockchain
     * @param id - The asset ID to fetch
     * @param network - The Algorand network to use
     * @returns A promise resolving to the asset parameters
     */
    static async fetchAssetParams(id, network) {
        const client = getAlgodClient(network);
        const asset = await client.getAssetByID(id).do();
        return asset.params;
    }
    /**
     * Gets the asset parameters
     * @returns The asset parameters
     */
    get() {
        return this.assetParams;
    }
    /**
     * Gets the creator address of the asset
     * @returns The creator address
     */
    getCreator() {
        return this.assetParams.creator;
    }
    /**
     * Gets the clawback address of the asset
     * @returns The clawback address or the zero address if not set
     */
    getClawback() {
        return this.assetParams.clawback ?? ALGORAND_ZERO_ADDRESS_STRING;
    }
    /**
     * Gets the freeze address of the asset
     * @returns The freeze address or the zero address if not set
     */
    getFreeze() {
        return this.assetParams.freeze ?? ALGORAND_ZERO_ADDRESS_STRING;
    }
    /**
     * Gets the reserve address of the asset
     * @returns The reserve address or the zero address if not set
     */
    getReserve() {
        return this.assetParams.reserve ?? ALGORAND_ZERO_ADDRESS_STRING;
    }
    /**
     * Gets the manager address of the asset
     * @returns The manager address or the zero address if not set
     */
    getManager() {
        return this.assetParams.manager ?? ALGORAND_ZERO_ADDRESS_STRING;
    }
    /**
     * Checks if the asset has a clawback address
     * @returns True if the asset has a clawback address
     */
    hasClawback() {
        return this.assetParams.clawback !== ALGORAND_ZERO_ADDRESS_STRING;
    }
    /**
     * Checks if the asset has a freeze address
     * @returns True if the asset has a freeze address
     */
    hasFreeze() {
        return this.assetParams.freeze !== ALGORAND_ZERO_ADDRESS_STRING;
    }
    /**
     * Checks if the asset has a reserve address
     * @returns True if the asset has a reserve address
     */
    hasReserve() {
        return this.assetParams.reserve !== ALGORAND_ZERO_ADDRESS_STRING;
    }
    /**
     * Checks if the asset has a manager address
     * @returns True if the asset has a manager address
     */
    hasManager() {
        return this.assetParams.manager !== ALGORAND_ZERO_ADDRESS_STRING;
    }
    /**
     * Gets the asset ID
     * @returns The asset ID
     */
    getIndex() {
        return this.id;
    }
    /**
     * Gets the asset name
     * @returns The asset name or empty string if not set
     */
    getName() {
        return this.assetParams.name ?? '';
    }
    /**
     * Gets the asset unit name
     * @returns The asset unit name or empty string if not set
     */
    getUnitName() {
        return this.assetParams.unitName ?? '';
    }
    /**
     * Gets the asset decimals
     * @returns The number of decimals for the asset
     */
    getDecimals() {
        return this.assetParams.decimals;
    }
    /**
     * Gets the total supply in base units
     * @returns The total supply in base units
     */
    getTotal() {
        return Number(this.assetParams.total);
    }
    /**
     * Gets the total supply adjusted for decimals
     * @returns The total supply adjusted for decimals
     */
    getTotalSupply() {
        return this.getTotal() / 10 ** this.getDecimals();
    }
    /**
     * Converts an amount from base units to decimal-adjusted units
     * @param amount - The amount in base units
     * @returns The amount adjusted for decimals
     */
    getAmountInDecimals(amount) {
        return amount / 10 ** this.getDecimals();
    }
    /**
     * Converts an amount from decimal-adjusted units to base units
     * @param amount - The amount in decimal-adjusted units
     * @returns The amount in base units
     */
    getAmountInBaseUnits(amount) {
        return amount * 10 ** this.getDecimals();
    }
    /**
     * Gets whether the asset is frozen by default
     * @returns True if the asset is frozen by default
     */
    getDefaultFrozen() {
        return this.assetParams.defaultFrozen ?? false;
    }
    /**
     * Gets the asset URL
     * @returns The asset URL or empty string if not set
     */
    getUrl() {
        return this.assetParams.url ?? '';
    }
    /**
     * Gets the asset metadata hash
     * @returns The metadata hash as a string
     */
    getMetadataHash() {
        const textDecoder = new TextDecoder();
        return textDecoder.decode(this.assetParams.metadataHash ?? new Uint8Array());
    }
    /**
     * Gets the protocol part of the asset URL
     * @returns The URL protocol or empty string if not found
     */
    getUrlProtocol() {
        const url = this.getUrl();
        if (!url)
            return '';
        const [protocol] = url.split('://');
        return protocol || '';
    }
    /**
     * Checks if the asset URL uses HTTP or HTTPS protocol
     * @returns True if the URL uses HTTP or HTTPS
     */
    hasHttpUrl() {
        return (this.getUrlProtocol() === 'http' || this.getUrlProtocol() === 'https');
    }
    /**
     * Checks if the asset URL uses IPFS protocol
     * @returns True if the URL uses IPFS
     */
    hasIpfsUrl() {
        return this.getUrlProtocol() === 'ipfs';
    }
    /**
     * Checks if the asset URL uses template-ipfs protocol
     * @returns True if the URL uses template-ipfs
     */
    hasTemplateUrl() {
        return this.getUrlProtocol() === 'template-ipfs';
    }
}
//# sourceMappingURL=coreAsset.js.map