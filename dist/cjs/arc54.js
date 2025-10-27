"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Arc54 = void 0;
const algosdk_1 = __importStar(require("algosdk"));
const utils_1 = require("./utils");
const abis_1 = require("./abis");
class Arc54 {
    static getAppInfo(network) {
        const appId = network === 'mainnet' ? 1257620981 : 497806551;
        const appAddress = (0, algosdk_1.getApplicationAddress)(appId);
        return {
            appId,
            appAddress,
        };
    }
    static async isOptedIn(network, assetId, address) {
        const algodClient = (0, utils_1.getAlgodClient)(network);
        try {
            await algodClient.accountAssetInformation(address, assetId).do();
        }
        catch {
            return false;
        }
        return true;
    }
    static async burnAsset(network, assetId, amount, sender) {
        const algodClient = (0, utils_1.getAlgodClient)(network);
        const appInfo = this.getAppInfo(network);
        const suggestedParams = await algodClient.getTransactionParams().do();
        const atc = new algosdk_1.default.AtomicTransactionComposer();
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
                method: abis_1.arc54Abi.getMethodByName('arc54_optIntoASA'),
                methodArgs: [assetId],
                appForeignAssets: [assetId],
                sender: sender.address,
                suggestedParams,
                signer: sender.signer,
            });
        }
        if (availableBalance < algosdk_1.default.algosToMicroalgos(0.1)) {
            atc.addTransaction({
                txn: algosdk_1.default.makePaymentTxnWithSuggestedParamsFromObject({
                    sender: sender.address,
                    suggestedParams,
                    amount: algosdk_1.default.algosToMicroalgos(0.1),
                    receiver: appInfo.appAddress,
                }),
                signer: sender.signer,
            });
        }
        atc.addTransaction({
            txn: algosdk_1.default.makeAssetTransferTxnWithSuggestedParamsFromObject({
                sender: sender.address,
                suggestedParams,
                assetIndex: assetId,
                receiver: appInfo.appAddress,
                amount: amount,
            }),
            signer: sender.signer,
        });
        const result = await atc.submit(algodClient);
        await algosdk_1.default.waitForConfirmation(algodClient, result[result.length - 1], 3);
        return result[result.length - 1];
    }
    static async getBurnedAmount(network, assetId) {
        try {
            const algodClient = (0, utils_1.getAlgodClient)(network);
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
exports.Arc54 = Arc54;
//# sourceMappingURL=arc54.js.map