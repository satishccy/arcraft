import algosdk, { TransactionSigner } from 'algosdk';
import { Network } from './types';
export declare class Arc54 {
    static getAppInfo(network: Network): {
        appId: number;
        appAddress: algosdk.Address;
    };
    static isOptedIn(network: Network, assetId: number, address: string): Promise<boolean>;
    static burnAsset(network: Network, assetId: number, amount: number, sender: {
        address: string;
        signer: TransactionSigner;
    }): Promise<string>;
    static getBurnedAmount(network: Network, assetId: number): Promise<bigint>;
}
