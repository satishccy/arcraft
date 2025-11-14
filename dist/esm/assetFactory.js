/**
 * Asset Factory for creating appropriate ARC instances based on asset properties
 * This factory resolves circular dependency issues between CoreAsset and ARC classes
 * @module assetFactory
 */
import { CoreAsset } from './coreAsset';
import { Arc3 } from './arc3';
import { Arc19 } from './arc19';
import { Arc69 } from './arc69';
/**
 * Factory class for creating the appropriate asset instance based on ARC standards
 */
export class AssetFactory {
    /**
     * Creates the appropriate asset instance from an asset ID
     * @param id - The asset ID to load
     * @param network - The Algorand network to use
     * @returns A promise resolving to the appropriate asset instance
     */
    static async fromId(id, network) {
        const assetParams = await CoreAsset.fetchAssetParams(id, network);
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
        if (Arc3.isArc3(assetParams.name || '', assetParams.url || '', id)) {
            return await Arc3.fromAssetParams(id, assetParams, network);
        }
        // Check for ARC-19 compliance
        if (Arc19.isArc19(assetParams.url || '')) {
            return await Arc19.fromAssetParams(id, assetParams, network);
        }
        // Check for ARC-69 compliance (requires network call)
        const isArc69 = await Arc69.isArc69(assetParams.url || '', id, network);
        if (isArc69) {
            return await Arc69.fromAssetParams(id, assetParams, network);
        }
        // Default to CoreAsset if no ARC standard is detected
        return new CoreAsset(id, assetParams, network);
    }
    /**
     * Gets the ARC standard type of an asset
     * @param id - The asset ID
     * @param network - The Algorand network
     * @returns The ARC standard type or 'unknown'
     */
    static async getArcType(id, network) {
        const assetParams = await CoreAsset.fetchAssetParams(id, network);
        if (Arc3.isArc3(assetParams.name || '', assetParams.url || '', id)) {
            return 'arc3';
        }
        if (Arc19.isArc19(assetParams.url || '')) {
            return 'arc19';
        }
        if (await Arc69.isArc69(assetParams.url || '', id, network)) {
            return 'arc69';
        }
        return 'unknown';
    }
}
//# sourceMappingURL=assetFactory.js.map