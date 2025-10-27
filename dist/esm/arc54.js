import algosdk, { getApplicationAddress } from 'algosdk';
import { getAlgodClient } from './utils';
import { arc54Abi } from './abis';
export class Arc54 {
    static getAppInfo(network) {
        const appId = network === 'mainnet' ? 1257620981 : 497806551;
        const appAddress = getApplicationAddress(appId);
        return {
            appId,
            appAddress,
        };
    }
    static async isOptedIn(network, assetId, address) {
        const algodClient = getAlgodClient(network);
        try {
            await algodClient.accountAssetInformation(address, assetId).do();
        }
        catch {
            return false;
        }
        return true;
    }
    static async burnAsset(network, assetId, amount, sender) {
        const algodClient = getAlgodClient(network);
        const appInfo = this.getAppInfo(network);
        const suggestedParams = await algodClient.getTransactionParams().do();
        const atc = new algosdk.AtomicTransactionComposer();
        const accountInfo = await algodClient
            .accountInformation(sender.address)
            .do();
        const availableBalance = accountInfo.amount - accountInfo.minBalance > 0n
            ? accountInfo.amount - accountInfo.minBalance
            : 0n;
        const isOptedIn = await this.isOptedIn(network, assetId, sender.address);
        if (!isOptedIn) {
            atc.addMethodCall({
                appID: appInfo.appId,
                method: arc54Abi.getMethodByName('arc54_optIntoASA'),
                methodArgs: [assetId],
                appForeignAssets: [assetId],
                sender: sender.address,
                suggestedParams,
                signer: sender.signer,
            });
        }
        if (availableBalance < algosdk.algosToMicroalgos(0.1)) {
            atc.addTransaction({
                txn: algosdk.makePaymentTxnWithSuggestedParamsFromObject({
                    sender: sender.address,
                    suggestedParams,
                    amount: algosdk.algosToMicroalgos(0.1),
                    receiver: appInfo.appAddress,
                }),
                signer: sender.signer,
            });
        }
        atc.addTransaction({
            txn: algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                sender: sender.address,
                suggestedParams,
                assetIndex: assetId,
                receiver: appInfo.appAddress,
                amount: amount,
            }),
            signer: sender.signer,
        });
        const result = await atc.submit(algodClient);
        await algosdk.waitForConfirmation(algodClient, result[result.length - 1], 3);
        return result[result.length - 1];
    }
    static async getBurnedAmount(network, assetId) {
        try {
            const algodClient = getAlgodClient(network);
            const appInfo = this.getAppInfo(network);
            const assetAmount = await algodClient
                .accountAssetInformation(appInfo.appAddress, assetId)
                .do();
            return assetAmount?.assetHolding?.amount ?? 0n;
        }
        catch {
            return 0n;
        }
    }
}
//# sourceMappingURL=arc54.js.map