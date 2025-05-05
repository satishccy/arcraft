import { CoreAsset } from './coreAsset';
import { Network } from './types';
import { TransactionSigner } from 'algosdk';
import { IPFS } from './ipfs';
declare class Arc3 extends CoreAsset {
    metadata: object;
    private constructor();
    protected static fetchMetadata(url: string): Promise<object>;
    static resolveUrl(url: string, id: number): string;
    static fromId(id: number, network: Network): Promise<Arc3>;
    hasValidName(): boolean;
    hasValidUrl(): boolean;
    isArc3(): boolean;
    getMetadata(): object;
    static create({ name, unitName, creator, ipfs, image, imageName, properties, network, defaultFrozen, manager, reserve, freeze, clawback, }: {
        name: string;
        unitName: string;
        creator: {
            address: string;
            signer: TransactionSigner;
        };
        ipfs: IPFS;
        image: string;
        imageName: string;
        properties: object;
        network: Network;
        defaultFrozen?: boolean;
        manager?: string;
        reserve?: string;
        freeze?: string;
        clawback?: string;
    }): Promise<{
        txid: string;
        assetId: bigint | undefined;
    }>;
    private static calculateSHA256;
}
export { Arc3 };
