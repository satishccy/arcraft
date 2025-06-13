/**
 * Asset Factory for creating appropriate ARC instances based on asset properties
 * This factory resolves circular dependency issues between CoreAsset and ARC classes
 * @module assetFactory
 */
import { CoreAsset } from './coreAsset';
import { Arc3 } from './arc3';
import { Arc19 } from './arc19';
import { Arc69 } from './arc69';
import { Network } from './types';
import { AssetParams } from 'algosdk/dist/types/client/v2/algod/models/types';
/**
 * Factory class for creating the appropriate asset instance based on ARC standards
 */
export declare class AssetFactory {
    /**
     * Creates the appropriate asset instance from an asset ID
     * @param id - The asset ID to load
     * @param network - The Algorand network to use
     * @returns A promise resolving to the appropriate asset instance
     */
    static fromId(id: number, network: Network): Promise<CoreAsset | Arc3 | Arc69 | Arc19>;
    /**
     * Creates the appropriate asset instance from asset parameters
     * @param id - The asset ID
     * @param assetParams - The asset parameters
     * @param network - The Algorand network
     * @returns A promise resolving to the appropriate asset instance
     */
    static fromAssetParams(id: number, assetParams: AssetParams, network: Network): Promise<CoreAsset | Arc3 | Arc69 | Arc19>;
    /**
     * Gets the ARC standard type of an asset
     * @param id - The asset ID
     * @param network - The Algorand network
     * @returns The ARC standard type or 'unknown'
     */
    static getArcType(id: number, network: Network): Promise<'arc3' | 'arc19' | 'arc69' | 'unknown'>;
}
