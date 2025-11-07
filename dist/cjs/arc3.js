"use strict";
/**
 * Implementation of the Algorand ARC-3 standard for NFTs.
 * @module arc3
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Arc3 = void 0;
const coreAsset_1 = require("./coreAsset");
const const_1 = require("./const");
const algosdk_1 = __importStar(require("algosdk"));
const mimeUtils_1 = require("./mimeUtils");
const utils_1 = require("./utils");
const fs_1 = __importDefault(require("fs"));
/**
 * Class representing an ARC-3 compliant NFT on Algorand.
 * Extends CoreAsset with metadata handling for the ARC-3 standard.
 */
class Arc3 extends coreAsset_1.CoreAsset {
    /**
     * Creates an instance of Arc3.
     * @param id - The asset ID
     * @param params - The asset parameters from the Algorand blockchain
     * @param network - The Algorand network this asset exists on
     * @param metadata - The metadata associated with the asset
     */
    constructor(id, params, network, metadata) {
        super(id, params, network);
        this.metadata = metadata;
    }
    /**
     * Fetches metadata from a given URL
     * @param url - The URL to fetch metadata from
     * @returns A promise resolving to the metadata object
     * @throws Error if metadata cannot be fetched or parsed
     */
    static async fetchMetadata(url) {
        try {
            const metadataResponse = await fetch(url);
            return metadataResponse.json();
        }
        catch (error) {
            return undefined;
        }
    }
    /**
     * Resolves URLs, handling IPFS protocol and ID replacements
     * @param url - The URL to resolve (may contain {id} placeholder)
     * @param id - The asset ID to replace in the URL if needed
     * @returns The resolved URL with proper protocol
     */
    static resolveUrl(url, id) {
        let resolvedUrl = url;
        if (url.includes('{id}')) {
            resolvedUrl = url.replace('{id}', id.toString());
        }
        if (resolvedUrl.startsWith('https://') ||
            resolvedUrl.startsWith('http://')) {
            return resolvedUrl;
        }
        else if (resolvedUrl.startsWith('ipfs://')) {
            return `${const_1.IPFS_GATEWAY}${resolvedUrl.slice(7)}`;
        }
        else {
            return '';
        }
    }
    /**
     * Creates an Arc3 instance from an existing asset ID
     * @param id - The asset ID to load
     * @param network - The Algorand network to use
     * @returns A promise resolving to an Arc3 instance
     * @throws Error if the asset cannot be loaded
     */
    static async fromId(id, network) {
        const asset = await coreAsset_1.CoreAsset.fromId(id, network);
        let metadata = {};
        try {
            const resolvedUrl = this.resolveUrl(asset.getUrl(), id);
            metadata = await this.fetchMetadata(resolvedUrl);
        }
        catch (e) {
            // Metadata fetch failed, use empty object
        }
        return new Arc3(id, asset.assetParams, network, metadata);
    }
    /**
     * Creates an Arc3 instance from existing asset parameters
     * @param id - The asset ID
     * @param assetParams - The asset parameters from the blockchain
     * @param network - The Algorand network to use
     * @returns A promise resolving to an Arc3 instance
     */
    static async fromAssetParams(id, assetParams, network) {
        let metadata = {};
        try {
            const resolvedUrl = this.resolveUrl(assetParams.url || '', id);
            metadata = await this.fetchMetadata(resolvedUrl);
        }
        catch (e) {
            // Metadata fetch failed, use empty object
        }
        return new Arc3(id, assetParams, network, metadata);
    }
    /**
     * Checks if the asset has a valid ARC-3 name
     * @param name - The asset name to validate
     * @returns True if the asset name is ARC-3 compliant
     */
    static hasValidName(name) {
        if (!name) {
            return false;
        }
        if (name.toLowerCase() == 'arc3') {
            return true;
        }
        else if (name.toLowerCase().endsWith('arc3')) {
            return true;
        }
        return false;
    }
    /**
     * Checks if the asset has a valid ARC-3 URL
     * @param url - The asset URL to validate
     * @param id - The asset ID for URL resolution
     * @returns True if the asset URL is ARC-3 compliant
     */
    static hasValidUrl(url, id) {
        if (!url) {
            return false;
        }
        const resolvedUrl = Arc3.resolveUrl(url, id);
        if (resolvedUrl.toLowerCase().endsWith('#arc3')) {
            return true;
        }
        return false;
    }
    /**
     * Checks if the asset is ARC-3 compliant
     * @param name - The asset name to check
     * @param url - The asset URL to check
     * @param id - The asset ID for URL resolution
     * @returns True if the asset is ARC-3 compliant
     */
    static isArc3(name, url, id) {
        if (!name || !url) {
            return false;
        }
        return Arc3.hasValidName(name) || Arc3.hasValidUrl(url, id);
    }
    /**
     * Gets the metadata associated with the asset
     * @returns The metadata object
     */
    getMetadata() {
        return this.metadata;
    }
    /**
     * Gets the metadata URL for this ARC-3 asset
     * @returns The resolved metadata URL
     */
    getMetadataUrl() {
        return Arc3.resolveUrl(this.metadata.image, this.id);
    }
    /**
     * Gets the image URL associated with the asset
     * @returns The resolved image URL or empty string if no image
     */
    getImageUrl() {
        if (!this.metadata || !this.metadata.image) {
            return '';
        }
        return Arc3.resolveUrl(this.metadata.image, this.id);
    }
    /**
     * Gets the image as a base64 encoded string
     * @returns A promise resolving to the base64 encoded image
     * @throws Error if no image is available or fetch fails
     */
    async getImageBase64() {
        if (!this.metadata.image) {
            return '';
        }
        const imageUrl = Arc3.resolveUrl(this.metadata.image, this.id);
        const imageResponse = await fetch(imageUrl);
        const imageBlob = await imageResponse.blob();
        const imageBuffer = await imageBlob.arrayBuffer();
        const imageBase64 = utils_1.UniversalBuffer.from(imageBuffer).toString('base64');
        return imageBase64;
    }
    /**
     * Creates a new ARC-3 compliant NFT on the Algorand blockchain
     * @param options - The configuration options for creating the ARC-3 NFT
     * @returns A promise resolving to an object containing the transaction ID and asset ID
     * @throws Error if creation fails
     */
    static async create({ name, unitName, creator, ipfs, image, properties, network, defaultFrozen = false, manager = undefined, reserve = undefined, freeze = undefined, clawback = undefined, total = 1, decimals = 0, }) {
        // Upload image to IPFS
        let imageCid;
        if (typeof image.file === 'string') {
            imageCid = await ipfs.upload(image.file, image.name);
        }
        else {
            imageCid = await ipfs.upload(image.file, image.name);
        }
        const mimeType = typeof image.file === 'string'
            ? (0, mimeUtils_1.lookup)(image.name)
            : (0, mimeUtils_1.lookupFromFile)(image.file);
        let blob;
        if (typeof image.file === 'string') {
            const buffer = await fs_1.default.promises.readFile(image.file);
            const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
            blob = new Blob([arrayBuffer], {
                type: mimeType,
            });
        }
        else {
            blob = new Blob([await image.file.arrayBuffer()], {
                type: mimeType,
            });
        }
        // Calculate SHA256 hash for image integrity
        const imageHash = await this.calculateSHA256(blob);
        // Create ARC-3 compliant metadata
        const metadata = {
            name: name,
            unit_name: unitName,
            creator: creator.address,
            image: `ipfs://${imageCid}#arc3`,
            image_integrity: `sha256-${imageHash}`,
            image_mimetype: mimeType,
            properties: properties,
        };
        // Upload metadata to IPFS
        const metadataCid = await ipfs.uploadJson(metadata, 'metadata.json');
        // Create the asset on the blockchain using AtomicTransactionComposer
        const client = (0, utils_1.getAlgodClient)(network);
        const atc = new algosdk_1.AtomicTransactionComposer();
        const sp = await client.getTransactionParams().do();
        atc.addTransaction({
            txn: algosdk_1.default.makeAssetCreateTxnWithSuggestedParamsFromObject({
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
                total: total,
                decimals: decimals,
            }),
            signer: creator.signer,
        });
        const result = await atc.submit(client);
        const txnStatus = await algosdk_1.default.waitForConfirmation(client, result[0], 3);
        return {
            transactionId: result[0],
            assetId: Number(txnStatus.assetIndex || 0),
        };
    }
    /**
     * Creates a new ARC-3 compliant NFT Transaction on the Algorand blockchain
     * @param options - The configuration options for creating the ARC-3 NFT Transaction
     * @returns A promise resolving to an algosdk.Transaction object
     * @throws Error if transaction creation fails
     */
    static async makeAssetCreateTransaction({ name, unitName, creator, ipfs, image, properties, network, defaultFrozen = false, manager = undefined, reserve = undefined, freeze = undefined, clawback = undefined, total = 1, decimals = 0, }) {
        // Upload image to IPFS
        let imageCid;
        if (typeof image.file === 'string') {
            imageCid = await ipfs.upload(image.file, image.name);
        }
        else {
            imageCid = await ipfs.upload(image.file, image.name);
        }
        const mimeType = typeof image.file === 'string'
            ? (0, mimeUtils_1.lookup)(image.name)
            : (0, mimeUtils_1.lookupFromFile)(image.file);
        let blob;
        if (typeof image.file === 'string') {
            const buffer = await fs_1.default.promises.readFile(image.file);
            const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
            blob = new Blob([arrayBuffer], {
                type: mimeType,
            });
        }
        else {
            blob = new Blob([await image.file.arrayBuffer()], {
                type: mimeType,
            });
        }
        // Calculate SHA256 hash for image integrity
        const imageHash = await this.calculateSHA256(blob);
        // Create ARC-3 compliant metadata
        const metadata = {
            name: name,
            unit_name: unitName,
            creator: creator.address,
            image: `ipfs://${imageCid}#arc3`,
            image_integrity: `sha256-${imageHash}`,
            image_mimetype: mimeType,
            properties: properties,
        };
        // Upload metadata to IPFS
        const metadataCid = await ipfs.uploadJson(metadata, 'metadata.json');
        const client = (0, utils_1.getAlgodClient)(network);
        const sp = await client.getTransactionParams().do();
        return algosdk_1.default.makeAssetCreateTxnWithSuggestedParamsFromObject({
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
            total: total,
            decimals: decimals,
        });
    }
    /**
     * Calculates SHA256 hash of blob content
     * @param blobContent - The blob content to hash
     * @returns Promise resolving to hex-encoded hash string
     * @throws Error if no blob content provided
     * @private
     */
    static async calculateSHA256(blobContent) {
        if (!blobContent) {
            throw Error('No Blob found in calculateSHA256');
        }
        try {
            const buffer = await blobContent.arrayBuffer();
            return await (0, utils_1.calculateSHA256)(buffer);
        }
        catch (error) {
            throw error;
        }
    }
}
exports.Arc3 = Arc3;
//# sourceMappingURL=arc3.js.map