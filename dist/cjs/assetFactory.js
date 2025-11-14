"use strict";
/**
 * Asset Factory for creating appropriate ARC instances based on asset properties
 * This factory resolves circular dependency issues between CoreAsset and ARC classes
 * @module assetFactory
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetFactory = void 0;
const coreAsset_1 = require("./coreAsset");
const arc3_1 = require("./arc3");
const arc19_1 = require("./arc19");
const arc69_1 = require("./arc69");
/**
 * Factory class for creating the appropriate asset instance based on ARC standards
 */
class AssetFactory {
    /**
     * Creates the appropriate asset instance from an asset ID
     * @param id - The asset ID to load
     * @param network - The Algorand network to use
     * @returns A promise resolving to the appropriate asset instance
     */
    static async fromId(id, network) {
        const assetParams = await coreAsset_1.CoreAsset.fetchAssetParams(id, network);
        return this.fromAssetParams(id, assetParams, network);
    }
    /**
     * Creates the appropriate asset instance from asset parameters
     * @param id - The asset ID
     * @param assetParams - The asset parameters
     * @param network - The Algorand network
     * @returns A promise resolving to the appropriate asset instance
     */
    static async fromAssetParams(id, assetParams, network) {
        // Check for ARC-3 compliance first
        if (arc3_1.Arc3.isArc3(assetParams.name || '', assetParams.url || '', id)) {
            return await arc3_1.Arc3.fromAssetParams(id, assetParams, network);
        }
        // Check for ARC-19 compliance
        if (arc19_1.Arc19.isArc19(assetParams.url || '')) {
            return await arc19_1.Arc19.fromAssetParams(id, assetParams, network);
        }
        // Check for ARC-69 compliance (requires network call)
        const isArc69 = await arc69_1.Arc69.isArc69(assetParams.url || '', id, network);
        if (isArc69) {
            return await arc69_1.Arc69.fromAssetParams(id, assetParams, network);
        }
        // Default to CoreAsset if no ARC standard is detected
        return new coreAsset_1.CoreAsset(id, assetParams, network);
    }
    /**
     * Gets the ARC standard type of an asset
     * @param id - The asset ID
     * @param network - The Algorand network
     * @returns The ARC standard type or 'unknown'
     */
    static async getArcType(id, network) {
        const assetParams = await coreAsset_1.CoreAsset.fetchAssetParams(id, network);
        if (arc3_1.Arc3.isArc3(assetParams.name || '', assetParams.url || '', id)) {
            return 'arc3';
        }
        if (arc19_1.Arc19.isArc19(assetParams.url || '')) {
            return 'arc19';
        }
        if (await arc69_1.Arc69.isArc69(assetParams.url || '', id, network)) {
            return 'arc69';
        }
        return 'unknown';
    }
}
exports.AssetFactory = AssetFactory;
//# sourceMappingURL=assetFactory.js.map