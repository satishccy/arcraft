"use strict";
/**
 * Implementation of the Algorand ARC-69 standard for NFTs with embedded metadata.
 * ARC-69 stores metadata directly in transaction notes instead of external URLs.
 * @module arc69
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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Arc69 = void 0;
const coreAsset_1 = require("./coreAsset");
const utils_1 = require("./utils");
const const_1 = require("./const");
const algosdk_1 = __importStar(require("algosdk"));
const mimeUtils_1 = require("./mimeUtils");
const fs_1 = __importDefault(require("fs"));
/**
 * Class representing an ARC-69 compliant NFT on Algorand.
 * ARC-69 NFTs store metadata in transaction notes rather than external URLs.
 * Extends CoreAsset with metadata handling for the ARC-69 standard.
 */
class Arc69 extends coreAsset_1.CoreAsset {
    /**
     * Creates an instance of Arc69.
     * @param id - The asset ID on the Algorand blockchain
     * @param params - The asset parameters from the Algorand blockchain
     * @param network - The Algorand network this asset exists on
     * @param metadata - The metadata associated with the asset (from transaction notes)
     */
    constructor(id, params, network, metadata) {
        super(id, params, network);
        this.metadata = metadata;
    }
    /**
     * Fetches ARC-69 metadata from transaction notes for a given asset
     * @param assetId - The asset ID to fetch metadata for
     * @param network - The Algorand network to search on
     * @returns A promise resolving to the metadata object, or undefined if not found
     */
    static async fetchMetadata(assetId, network) {
        try {
            const indexerClient = (0, utils_1.getIndexerClient)(network);
            let txns = await indexerClient
                .lookupAssetTransactions(assetId)
                .txType('acfg')
                .do();
            let totalTxns = [...txns.transactions];
            while (true) {
                if (txns.nextToken) {
                    txns = await indexerClient
                        .lookupAssetTransactions(assetId)
                        .txType('acfg')
                        .nextToken(txns.nextToken)
                        .do();
                    totalTxns = [...totalTxns, ...txns.transactions];
                }
                else {
                    break;
                }
            }
            totalTxns.sort((a, b) => Number(a.roundTime) - Number(b.roundTime));
            for (const tx of totalTxns) {
                try {
                    const note = tx.note;
                    const decoder = new TextDecoder();
                    const metadata = JSON.parse(decoder.decode(note));
                    return metadata;
                }
                catch (e) {
                    console.error(e);
                    continue;
                }
            }
            return undefined;
        }
        catch (e) {
            console.error(e);
            return undefined;
        }
    }
    /**
     * Resolves standard URLs, handling HTTP/HTTPS and IPFS protocols
     * @param url - The URL to resolve
     * @returns The resolved URL with proper protocol
     */
    static resolveNormalUrl(url) {
        if (url.startsWith('https://') || url.startsWith('http://')) {
            return url;
        }
        else if (url.startsWith('ipfs://')) {
            return `${const_1.IPFS_GATEWAY}${url.slice(7)}`;
        }
        else {
            return '';
        }
    }
    /**
     * Public method to resolve URLs for ARC-69 assets
     * @param url - The URL to resolve
     * @returns The resolved URL
     */
    static resolveUrl(url) {
        return _a.resolveNormalUrl(url);
    }
    /**
     * Creates an Arc69 instance from an existing asset ID
     * @param id - The asset ID to load
     * @param network - The Algorand network to use
     * @returns A promise resolving to an Arc69 instance
     */
    static async fromId(id, network) {
        const asset = await coreAsset_1.CoreAsset.fromId(id, network);
        let metadata = {};
        try {
            metadata = await _a.fetchMetadata(id, network);
        }
        catch (e) {
            // Metadata fetch failed, use empty object
        }
        return new _a(id, asset.assetParams, network, metadata);
    }
    /**
     * Creates an Arc69 instance from existing asset parameters
     * @param id - The asset ID
     * @param assetParams - The asset parameters from the blockchain
     * @param network - The Algorand network to use
     * @returns A promise resolving to an Arc69 instance
     */
    static async fromAssetParams(id, assetParams, network) {
        let metadata = {};
        try {
            metadata = await _a.fetchMetadata(id, network);
        }
        catch (e) {
            // Metadata fetch failed, use empty object
        }
        return new _a(id, assetParams, network, metadata);
    }
    /**
     * Checks if an asset has valid ARC-69 metadata in its transaction notes
     * @param assetId - The asset ID to check
     * @param network - The Algorand network to search on
     * @returns True if the asset has valid ARC-69 metadata
     */
    static async hasValidMetadata(assetId, network) {
        try {
            const metadata = await _a.fetchMetadata(assetId, network);
            console.log('metadata', metadata);
            if (metadata) {
                if (metadata.standard === 'arc69') {
                    return true;
                }
            }
        }
        catch (e) {
            console.error(e);
        }
        return false;
    }
    /**
     * Validates if a URL conforms to ARC-69 standards
     * @param url - The URL to validate
     * @returns True if the URL is valid for ARC-69
     */
    static hasValidUrl(url) {
        if (!url) {
            return false;
        }
        const mediaType = url.split('#')[1] || 'i'; // Default to image if no media type specified
        const validMediaTypes = ['i', 'v', 'a', 'p', 'h'];
        if (!validMediaTypes.includes(mediaType)) {
            return false;
        }
        return url.startsWith('ipfs://') || url.startsWith('https://');
    }
    /**
     * Determines if an asset is ARC-69 compliant
     * @param url - The asset URL to check
     * @param id - The asset ID
     * @param network - The Algorand network to check on
     * @returns True if the asset is ARC-69 compliant
     */
    static async isArc69(url, id, network) {
        if (!url) {
            return false;
        }
        const isValidUrl = _a.hasValidUrl(url);
        const isValidMetadata = await _a.hasValidMetadata(id, network);
        console.log('isValidUrl', isValidUrl, 'isValidMetadata', isValidMetadata);
        return isValidUrl && isValidMetadata;
    }
    /**
     * Gets the metadata associated with this ARC-69 asset
     * @returns The metadata object
     */
    getMetadata() {
        return this.metadata;
    }
    /**
     * Gets the resolved image URL for this ARC-69 asset
     * @returns The resolved image URL
     */
    getImageUrl() {
        return _a.resolveUrl(this.getUrl());
    }
    /**
     * Gets the image as a base64 encoded string
     * @returns A promise resolving to the base64 encoded image
     */
    async getImageBase64() {
        const imageUrl = this.getImageUrl();
        const imageResponse = await fetch(imageUrl);
        const imageBlob = await imageResponse.blob();
        const imageBuffer = await imageBlob.arrayBuffer();
        const imageBase64 = utils_1.UniversalBuffer.from(imageBuffer).toString('base64');
        return imageBase64;
    }
    /**
     * Creates a new ARC-69 compliant NFT on the Algorand blockchain
     * @param options - Configuration options for creating the ARC-69 NFT
     * @returns A promise resolving to an object containing the transaction ID and asset ID
     */
    static async create({ name, unitName, creator, ipfs, image, properties, network, defaultFrozen = false, manager = undefined, reserve = undefined, freeze = undefined, clawback = undefined, total = 1, decimals = 0, }) {
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
            blob = new Blob([await fs_1.default.promises.readFile(image.file)], {
                type: mimeType,
            });
        }
        else {
            blob = new Blob([await image.file.arrayBuffer()], {
                type: mimeType,
            });
        }
        const hash = await this.calculateSHA256(blob);
        const metadata = {
            standard: 'arc69',
            external_url: `ipfs://${imageCid}#i`,
            image_integrity: `sha256-${hash}`,
            mime_type: mimeType,
            properties: properties,
        };
        console.log(freeze, reserve, clawback, "metadata");
        const client = (0, utils_1.getAlgodClient)(network);
        const atc = new algosdk_1.AtomicTransactionComposer();
        let sp = await client.getTransactionParams().do();
        const noteField = new TextEncoder().encode(JSON.stringify(metadata));
        atc.addTransaction({
            txn: algosdk_1.default.makeAssetCreateTxnWithSuggestedParamsFromObject({
                sender: creator.address,
                suggestedParams: sp,
                defaultFrozen: defaultFrozen,
                unitName: unitName,
                assetName: name,
                manager: creator.address,
                reserve: reserve,
                freeze: freeze,
                clawback: clawback,
                assetURL: `ipfs://${imageCid}#i`,
                total: total,
                decimals: decimals,
                note: noteField,
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
     * Calculates the SHA256 hash of a file's content
     * @param blobContent - The file content as a Blob
     * @returns A promise resolving to the hex-encoded hash
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
exports.Arc69 = Arc69;
_a = Arc69;
/**
 * Updates the metadata properties of an existing ARC-69 NFT
 * @param options - Configuration options for updating the NFT metadata
 * @returns A promise resolving to an object containing the transaction ID and confirmed round
 */
Arc69.update = async ({ manager, properties, assetId, network, }) => {
    const client = (0, utils_1.getAlgodClient)(network);
    const coreAsset = await coreAsset_1.CoreAsset.fromId(assetId, network);
    if (manager.address !== coreAsset.assetParams.manager) {
        throw new Error('You are not the manager of the NFT to update');
    }
    const sp = await client.getTransactionParams().do();
    const metadata = await _a.fetchMetadata(assetId, network);
    if (!metadata) {
        throw Error('Metadata not found');
    }
    metadata.properties = properties;
    const noteField = new TextEncoder().encode(JSON.stringify(metadata));
    const noteAtc = new algosdk_1.AtomicTransactionComposer();
    noteAtc.addTransaction({
        txn: algosdk_1.default.makeAssetConfigTxnWithSuggestedParamsFromObject({
            sender: manager.address,
            assetIndex: assetId,
            note: noteField,
            suggestedParams: sp,
            manager: manager.address,
            reserve: coreAsset.assetParams.reserve,
            freeze: coreAsset.assetParams.freeze,
            clawback: coreAsset.assetParams.clawback,
            strictEmptyAddressChecking: false,
        }),
        signer: manager.signer,
    });
    const resultNote = await noteAtc.submit(client);
    const txnStatusNote = await algosdk_1.default.waitForConfirmation(client, resultNote[0], 3);
    return {
        transactionId: resultNote[0],
        confirmedRound: txnStatusNote.confirmedRound,
    };
};
/**
 * Retrieves all historical versions of metadata for an ARC-69 asset
 * @param assetId - The asset ID to get metadata versions for
 * @param network - The Algorand network to search on
 * @returns A promise resolving to an array of metadata objects
 */
Arc69.getMetadataVersions = async (assetId, network) => {
    const indexerClient = (0, utils_1.getIndexerClient)(network);
    var assets_txns = await indexerClient
        .lookupAssetTransactions(assetId)
        .txType('acfg')
        .do();
    const metadatas = [];
    for (var i = 0; i < assets_txns.transactions.length; i++) {
        try {
            const note = assets_txns.transactions[i].note;
            const decoder = new TextDecoder();
            const metadata = JSON.parse(decoder.decode(note));
            metadatas.push(metadata);
        }
        catch (e) {
            console.error(e);
        }
    }
    while (true) {
        if (assets_txns.nextToken) {
            assets_txns = await indexerClient
                .lookupAssetTransactions(assetId)
                .txType('acfg')
                .nextToken(assets_txns.nextToken)
                .do();
            for (var i = 0; i < assets_txns.transactions.length; i++) {
                try {
                    const note = assets_txns.transactions[i].note;
                    const decoder = new TextDecoder();
                    const metadata = JSON.parse(decoder.decode(note));
                    metadatas.push(metadata);
                }
                catch (e) {
                    console.error(e);
                }
            }
        }
        else {
            break;
        }
    }
    return metadatas;
};
//# sourceMappingURL=arc69.js.map