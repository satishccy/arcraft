"use strict";
/**
 * Implementation of the Algorand ARC-19 standard for NFTs.
 * @module arc19
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
exports.Arc19 = void 0;
const algosdk_1 = __importDefault(require("algosdk"));
const axios_1 = __importDefault(require("axios"));
const mime_types_1 = __importDefault(require("mime-types"));
const fs_1 = __importDefault(require("fs"));
const crypto_1 = __importDefault(require("crypto"));
const multiformats = __importStar(require("multiformats"));
const utils_1 = require("./utils");
const const_1 = require("./const");
const coreAsset_1 = require("./coreAsset");
/**
 * Class representing an ARC-19 compliant NFT on Algorand.
 * Extends CoreAsset with metadata handling for the ARC-19 standard.
 */
class Arc19 extends coreAsset_1.CoreAsset {
    /**
     * Creates an instance of Arc19.
     * @param id - The asset ID
     * @param params - The asset parameters from the Algorand blockchain
     * @param metadata - The metadata associated with the asset
     */
    constructor(id, params, network, metadata) {
        super(id, params, network);
        this.metadata = metadata;
    }
    static resolveUrl(url, reserveAddr) {
        let chunks = url.split('://');
        // Check if prefix is template-ipfs and if {ipfscid:..} is where CID would normally be
        if (chunks[0] === 'template-ipfs' && chunks[1].startsWith('{ipfscid:')) {
            // Look for something like: template:ipfs://{ipfscid:1:raw:reserve:sha2-256} and parse into components
            const cidComponents = chunks[1].split(':');
            if (cidComponents.length !== 5) {
                return '';
            }
            const [, cidVersion, cidCodec, asaField, cidHash] = cidComponents;
            if (cidHash.split('}')[0] !== 'sha2-256') {
                return '';
            }
            if (cidCodec !== 'raw' &&
                cidCodec !== 'dag-pb' &&
                cidCodec !== 'dag-cbor') {
                return '';
            }
            if (asaField !== 'reserve') {
                return '';
            }
            let cidCodecCode = 0x0;
            if (cidCodec === 'raw') {
                cidCodecCode = 0x55;
            }
            else if (cidCodec === 'dag-pb') {
                cidCodecCode = 0x70;
            }
            else if (cidCodec === 'dag-cbor') {
                cidCodecCode = 0x71;
            }
            // get 32 bytes Uint8Array reserve address - treating it as 32-byte sha2-256 hash
            const addr = algosdk_1.default.decodeAddress(reserveAddr);
            const mhdigest = multiformats.digest.create(0x12, addr.publicKey);
            const cid = multiformats.CID.create(parseInt(cidVersion), cidCodecCode, mhdigest);
            const ipfsCid = cid.toString() + '/' + chunks[1].split('/').slice(1).join('/');
            return `${const_1.IPFS_GATEWAY}${ipfsCid}`;
        }
        else {
            return '';
        }
    }
    /**
     * Creates an Arc19 instance from an existing asset ID
     * @param id - The asset ID to load
     * @param network - The Algorand network to use
     * @returns A promise resolving to an Arc19 instance
     */
    static async fromId(id, network) {
        const asset = await coreAsset_1.CoreAsset.fromId(id, network);
        let metadata = {};
        try {
            const metadataUrl = _a.resolveUrl(asset.getUrl(), asset.getReserve());
            const response = await axios_1.default.get(metadataUrl);
            metadata = response.data;
        }
        catch (e) {
            // Metadata fetch failed, use empty object
        }
        return new _a(id, asset.assetParams, network, metadata);
    }
    static async fromAssetParams(id, assetParams, network) {
        let metadata = {};
        try {
            const metadataUrl = _a.resolveUrl(assetParams.url || '', assetParams.reserve || '');
            const response = await axios_1.default.get(metadataUrl);
            metadata = response.data;
        }
        catch (e) {
            // Metadata fetch failed, use empty object
        }
        return new _a(id, assetParams, network, metadata);
    }
    static hasValidUrl(url) {
        if (!url) {
            return false;
        }
        if (!url.startsWith('template-ipfs://')) {
            return false;
        }
        const chunks = url.split('://');
        if (chunks.length < 1) {
            return false;
        }
        if (!chunks[1].startsWith('{ipfscid:')) {
            return false;
        }
        const cidComponents = chunks[1].split(':');
        if (cidComponents.length !== 5) {
            return false;
        }
        const [, , cidCodec, asaField, cidHash] = cidComponents;
        if (cidHash.split('}')[0] !== 'sha2-256') {
            return false;
        }
        if (cidCodec !== 'raw' &&
            cidCodec !== 'dag-pb' &&
            cidCodec !== 'dag-cbor') {
            return false;
        }
        if (asaField !== 'reserve') {
            return false;
        }
        return true;
    }
    static isArc19(url) {
        return _a.hasValidUrl(url);
    }
    static async calculateSHA256(blobContent) {
        if (!blobContent) {
            throw Error('No Blob found in calculateSHA256');
        }
        try {
            var buffer = Buffer.from(await blobContent.arrayBuffer());
            const hash = crypto_1.default.createHash('sha256');
            hash.update(buffer);
            return hash.digest('hex');
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * Converts a codec code to its string representation
     * @param code - The numeric codec code
     * @returns The codec string representation
     * @private
     */
    static codeToCodec(code) {
        switch (code.toString(16)) {
            case '55':
                return 'raw';
            case '70':
                return 'dag-pb';
            case '71':
                return 'dag-cbor';
            default:
                throw new Error('Unknown codec');
        }
    }
    /**
     * Creates a reserve address and asset URL from an IPFS CID
     * @param ipfsCid - The IPFS content identifier
     * @returns An object containing the asset URL and reserve address
     * @private
     */
    static createReserveAddressFromIpfsCid(ipfsCid) {
        const decoded = multiformats.CID.parse(ipfsCid);
        const version = decoded.version;
        const codec = this.codeToCodec(decoded.code);
        const assetURL = `template-ipfs://{ipfscid:${version}:${codec}:reserve:sha2-256}`;
        const reserveAddress = algosdk_1.default.encodeAddress(Uint8Array.from(Buffer.from(decoded.multihash.digest)));
        return { assetURL, reserveAddress };
    }
    /**
     * Resolves standard URLs, handling HTTP/HTTPS and IPFS protocols
     * @param url - The URL to resolve
     * @returns The resolved URL with proper protocol
     * @private
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
     * Gets the metadata associated with this ARC-19 asset
     * @returns The metadata object
     */
    getMetadata() {
        return this.metadata;
    }
    /**
     * Gets the resolved image URL for this ARC-19 asset
     * @returns The resolved image URL
     */
    getImageUrl() {
        if (!this.metadata.image) {
            return '';
        }
        return _a.resolveNormalUrl(this.metadata.image);
    }
    /**
     * Gets the image as a base64 encoded string
     * @returns A promise resolving to the base64 encoded image
     */
    async getImageBase64() {
        if (!this.metadata.image) {
            return '';
        }
        const imageUrl = _a.resolveNormalUrl(this.metadata.image);
        const imageResponse = await fetch(imageUrl);
        const imageBlob = await imageResponse.blob();
        const imageBuffer = await imageBlob.arrayBuffer();
        const imageBase64 = Buffer.from(imageBuffer).toString('base64');
        return imageBase64;
    }
    /**
     * Gets the metadata URL for this ARC-19 asset by resolving the template-ipfs URL
     * @returns The resolved metadata URL
     */
    getMetadataUrl() {
        const reserve = this.getReserve();
        const url = this.getUrl();
        if (!reserve || !url) {
            return '';
        }
        const chunks = url.split('://');
        const cidComponents = chunks[1].split(':');
        const [, cidVersion, cidCodec] = cidComponents;
        let cidCodecCode;
        if (cidCodec === 'raw') {
            cidCodecCode = 0x55;
        }
        else if (cidCodec === 'dag-pb') {
            cidCodecCode = 0x70;
        }
        else {
            return '';
        }
        const address = algosdk_1.default.decodeAddress(reserve);
        const mhdigest = multiformats.digest.create(0x12, address.publicKey);
        const cid = multiformats.CID.create(parseInt(cidVersion), cidCodecCode, mhdigest);
        return (const_1.IPFS_GATEWAY +
            cid.toString() +
            '/' +
            chunks[1].split('/').slice(1).join('/'));
    }
}
exports.Arc19 = Arc19;
_a = Arc19;
/**
 * Creates a new ARC-19 compliant NFT on the Algorand blockchain
 */
Arc19.create = async ({ name, unitName, creator, ipfs, image, properties, network, defaultFrozen = false, manager = undefined, freeze = undefined, clawback = undefined, total = 1, decimals = 0, }) => {
    // Upload image to IPFS
    let imageCid;
    if (typeof image.file === 'string') {
        imageCid = await ipfs.upload(image.file, image.name);
    }
    else {
        imageCid = await ipfs.upload(image.file, image.name);
    }
    const mimeType = mime_types_1.default.lookup(image.name) || 'application/octet-stream';
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
    const hash = await _a.calculateSHA256(blob);
    const metadata = {
        name: name,
        unitName: unitName,
        creator: creator.address,
        image: 'ipfs://' + imageCid,
        image_integrity: `sha256-${hash}`,
        image_mimetype: mimeType,
        properties: properties,
    };
    const metadataCid = await ipfs.uploadJson(metadata, 'metadata.json');
    const { assetURL, reserveAddress } = _a.createReserveAddressFromIpfsCid(metadataCid);
    const algodClient = (0, utils_1.getAlgodClient)(network);
    const suggestedParams = await algodClient.getTransactionParams().do();
    const nft_txn = algosdk_1.default.makeAssetCreateTxnWithSuggestedParamsFromObject({
        sender: creator.address,
        suggestedParams,
        defaultFrozen: defaultFrozen,
        unitName: unitName,
        assetName: name,
        manager: manager,
        reserve: reserveAddress,
        freeze: freeze,
        clawback: clawback,
        assetURL: assetURL,
        total: total,
        decimals: decimals,
    });
    const signed = await creator.signer([nft_txn], [0]);
    const txid = await algodClient.sendRawTransaction(signed[0]).do();
    const result = await algosdk_1.default.waitForConfirmation(algodClient, txid.txid, 3);
    return {
        transactionId: txid.txid,
        assetId: Number(result.assetIndex || 0),
    };
};
/**
 * Updates the metadata and/or image of an existing ARC-19 NFT
 * @param options - Configuration options for updating the NFT
 * @returns A promise resolving to an object with status and transaction details
 */
Arc19.update = async ({ manager, properties, image, assetId, ipfs, network, }) => {
    try {
        let metadata_url = '';
        const indexerClient = (0, utils_1.getIndexerClient)(network);
        var indexer_result = await indexerClient
            .lookupAssetByID(Number(assetId))
            .do();
        if (indexer_result.asset.params.url &&
            _a.hasValidUrl(indexer_result.asset.params.url)) {
            metadata_url = _a.resolveUrl(indexer_result.asset.params.url, indexer_result.asset.params.reserve || '');
            if (metadata_url === '') {
                return { status: false, err: 'Unable to resolve ipfs url' };
            }
        }
        else {
            return { status: false, err: 'Not a Mutable NFT' };
        }
        const metadata_res = await fetch(const_1.IPFS_GATEWAY + metadata_url.split('://')[1]);
        const metadata = await metadata_res.json();
        if (image) {
            const mimeType = mime_types_1.default.lookup(image.name) || 'application/octet-stream';
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
            const hash = await _a.calculateSHA256(blob);
            let imageCid;
            if (typeof image.file === 'string') {
                imageCid = await ipfs.upload(image.file, image.name);
            }
            else {
                imageCid = await ipfs.upload(image.file, image.name);
            }
            metadata.image = `ipfs://${imageCid}`;
            metadata.image_integrity = `sha256-${hash}`;
            metadata.image_mimetype = mimeType;
        }
        // adding owner
        if (properties) {
            metadata.properties = properties;
        }
        if (image || properties) {
            const metadataCid = await ipfs.uploadJson(metadata, 'metadata.json');
            const { assetURL, reserveAddress } = _a.createReserveAddressFromIpfsCid(metadataCid);
            const algodClient = (0, utils_1.getAlgodClient)(network);
            const suggestedParams = await algodClient.getTransactionParams().do();
            const updatetxn = algosdk_1.default.makeAssetConfigTxnWithSuggestedParamsFromObject({
                sender: manager.address,
                suggestedParams: suggestedParams,
                manager: manager.address,
                freeze: indexer_result.asset.params.freeze
                    ? indexer_result.asset.params.freeze
                    : undefined,
                clawback: indexer_result.asset.params.clawback
                    ? indexer_result.asset.params.clawback
                    : undefined,
                reserve: reserveAddress,
                assetIndex: Number(assetId),
                strictEmptyAddressChecking: false,
            });
            const signed = await manager.signer([updatetxn], [0]);
            const txid = await algodClient.sendRawTransaction(signed[0]).do();
            const result = await algosdk_1.default.waitForConfirmation(algodClient, txid.txid, 3);
            return {
                status: true,
                confirmedRound: result.confirmedRound,
                transactionId: txid.txid,
            };
        }
        else {
            return { status: false, err: 'No changes to update' };
        }
    }
    catch (e) {
        return { status: false, err: e };
    }
};
/**
 * Retrieves all historical versions of metadata for an ARC-19 asset
 * @param assetId - The asset ID to get metadata versions for
 * @param network - The Algorand network to search on
 * @returns A promise resolving to an array of metadata objects with round numbers
 */
Arc19.getMetadataVersions = async (assetId, network) => {
    const indexerClient = (0, utils_1.getIndexerClient)(network);
    var assets_txns = await indexerClient
        .searchForTransactions()
        .assetID(assetId)
        .txType('acfg')
        .do();
    var url = '';
    const metadatas = [];
    for (var i = 0; i < assets_txns.transactions.length; i++) {
        try {
            if (i == 0) {
                url =
                    assets_txns.transactions[i].assetConfigTransaction?.params?.url ||
                        '';
            }
            var round = assets_txns.transactions[i].confirmedRound || 0;
            var metadata_url = _a.resolveUrl(url, assets_txns.transactions[i].assetConfigTransaction?.params?.reserve ||
                '');
            var metadata_res = await fetch(const_1.IPFS_GATEWAY + metadata_url.split('://')[1]);
            var metadata = await metadata_res.json();
            var m = {};
            m[round.toString()] = metadata;
            metadatas.push(m);
        }
        catch (e) {
            console.error(e);
        }
    }
    while (true) {
        if (assets_txns.nextToken) {
            var assets_txns = await indexerClient
                .searchForTransactions()
                .assetID(assetId)
                .txType('acfg')
                .nextToken(assets_txns.nextToken)
                .do();
            for (var i = 0; i < assets_txns.transactions.length; i++) {
                try {
                    if (i == 0) {
                        url =
                            assets_txns.transactions[i].assetConfigTransaction?.params
                                ?.url || '';
                    }
                    var round = assets_txns.transactions[i].confirmedRound || 0;
                    var metadata_url = _a.resolveUrl(url, assets_txns.transactions[i].assetConfigTransaction?.params
                        ?.reserve || '');
                    var metadata_res = await fetch(const_1.IPFS_GATEWAY + metadata_url.split('://')[1]);
                    var metadata = await metadata_res.json();
                    var m = {};
                    m[round.toString()] = metadata;
                    metadatas.push(m);
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
//# sourceMappingURL=arc19.js.map