"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Arc62 = void 0;
const assetFactory_1 = require("./assetFactory");
const algosdk_1 = __importDefault(require("algosdk"));
const utils_1 = require("./utils");
const const_1 = require("./const");
const abis_1 = require("./abis");
const arc54_1 = require("./arc54");
/**
 * The Arc62 class provides methods for interacting with the ARC-62 standard,
 * which defines a standardized way to determine an asset's circulating supply.
 *
 * This class can check if an asset is ARC-62 compatible and fetch its
 * circulating supply, either by calling the on-chain contract method or by
 * using a fallback calculation for non-compliant assets.
 */
class Arc62 {
    /**
     * Checks if an asset is compatible with the ARC-62 standard.
     *
     * It first inspects the asset's metadata for an `arc-62` property. If not found,
     * it queries the indexer for historical asset configuration transactions with a
     * note prefix of `arc62:` to find the associated smart contract.
     *
     * @param assetId The ID of the asset to check.
     * @param network The network to use ('mainnet' or 'testnet').
     * @returns A promise that resolves to an object containing a boolean `compatible`
     *          and the `applicationId` if found (0 otherwise).
     * @example
     * ```ts
     * const arc62AssetId = 733094741; // An ARC-62 asset on TestNet
     * const result = await Arc62.isArc62Compatible(arc62AssetId, 'testnet');
     *
     * if (result.compatible) {
     *   console.log(`Asset is ARC-62 compatible with App ID: ${result.applicationId}`);
     * } else {
     *   console.log('Asset is not ARC-62 compatible.');
     * }
     * ```
     */
    static async isArc62Compatible(assetId, network) {
        const asset = await assetFactory_1.AssetFactory.fromId(assetId, network);
        if ('getMetadata' in asset) {
            const metadata = asset.getMetadata();
            if ('properties' in metadata) {
                if ('arc-62' in metadata.properties) {
                    if ('application-id' in metadata.properties['arc-62']) {
                        const applicationId = metadata.properties['arc-62']['application-id'];
                        try {
                            const parsedApplicationId = parseInt(String(applicationId), 10);
                            if (!isNaN(parsedApplicationId)) {
                                return {
                                    compatible: true,
                                    applicationId: parsedApplicationId,
                                };
                            }
                        }
                        catch (e) { }
                    }
                }
            }
        }
        // Query indexer for arc62 transactions
        try {
            const indexerClient = (0, utils_1.getIndexerClient)(network);
            const arc62Prefix = new TextEncoder().encode('arc62:');
            let configtxns = await indexerClient
                .lookupAssetTransactions(assetId)
                .txType('acfg')
                .do();
            const reconfigs = [];
            // Filter transactions by note prefix
            for (const txn of configtxns.transactions) {
                if (txn.note) {
                    const noteBytes = txn.note instanceof Uint8Array
                        ? txn.note
                        : (0, utils_1.base64ToUint8Array)(txn.note);
                    if (noteBytes.length >= arc62Prefix.length) {
                        const notePrefix = noteBytes.slice(0, arc62Prefix.length);
                        if (notePrefix.every((byte, i) => byte === arc62Prefix[i])) {
                            reconfigs.push(txn);
                        }
                    }
                }
            }
            // Handle pagination
            while (configtxns.nextToken) {
                configtxns = await indexerClient
                    .lookupAssetTransactions(assetId)
                    .txType('acfg')
                    .nextToken(configtxns.nextToken)
                    .do();
                for (const txn of configtxns.transactions) {
                    if (txn.note) {
                        const noteBytes = txn.note instanceof Uint8Array
                            ? txn.note
                            : (0, utils_1.base64ToUint8Array)(txn.note);
                        if (noteBytes.length >= arc62Prefix.length) {
                            const notePrefix = noteBytes.slice(0, arc62Prefix.length);
                            if (notePrefix.every((byte, i) => byte === arc62Prefix[i])) {
                                reconfigs.push(txn);
                            }
                        }
                    }
                }
            }
            const latest = reconfigs[reconfigs.length - 1];
            if (latest && latest.note) {
                const note = latest.note;
                const decoder = new TextDecoder();
                const encoder = new TextEncoder();
                try {
                    const noteBytes = note instanceof Uint8Array ? note : (0, utils_1.base64ToUint8Array)(note);
                    const noteStrDecoded = decoder.decode(noteBytes);
                    const arc62 = noteStrDecoded.split('arc62:');
                    if (arc62.length > 1 && arc62[1][0] === 'j') {
                        const json = JSON.parse(arc62[1].slice(1));
                        if (json['application-id']) {
                            return {
                                compatible: true,
                                applicationId: Number(json['application-id']),
                            };
                        }
                    }
                    else if (arc62.length > 1 && arc62[1][0] === 'm') {
                        const msgpack = encoder.encode(arc62[1].slice(1));
                        const decoded = algosdk_1.default.msgpackRawDecode(msgpack);
                        if (decoded['application-id']) {
                            return {
                                compatible: true,
                                applicationId: Number(decoded['application-id']),
                            };
                        }
                    }
                }
                catch (e) { }
            }
        }
        catch (e) { }
        return {
            compatible: false,
            applicationId: 0,
        };
    }
    /**
     * Gets the circulating supply of a given asset.
     *
     * If the asset is ARC-62 compatible, this method calls the
     * `arc62_get_circulating_supply` method on the associated smart contract
     * for an on-chain, verifiable result.
     *
     * If the asset is not ARC-62 compatible, it calculates the circulating supply
     * using a fallback formula: `Total Supply - Burned Amount (from ARC-54) - Reserve Amount`.
     *
     * @param assetId The ID of the asset to check.
     * @param network The network to use ('mainnet' or 'testnet').
     * @returns A promise that resolves to the circulating supply of the asset as a number.
     * @example
     * ```ts
     * const arc62AssetId = 733094741; // An ARC-62 asset on TestNet
     * const nonArc62AssetId = 10458941; // A regular asset on TestNet
     *
     * // Gets supply from the smart contract
     * const onChainSupply = await Arc62.getCirculatingSupply(arc62AssetId, 'testnet');
     * console.log(`On-chain circulating supply: ${onChainSupply}`);
     *
     * // Gets supply using the fallback calculation
     * const fallbackSupply = await Arc62.getCirculatingSupply(nonArc62AssetId, 'testnet');
     * console.log(`Fallback circulating supply: ${fallbackSupply}`);
     * ```
     */
    static async getCirculatingSupply(assetId, network) {
        const isArc62Compatible = await this.isArc62Compatible(assetId, network);
        const algodClient = (0, utils_1.getAlgodClient)(network);
        if (isArc62Compatible.compatible) {
            const suggestedParams = await algodClient.getTransactionParams().do();
            const atc = new algosdk_1.default.AtomicTransactionComposer();
            atc.addMethodCall({
                appID: isArc62Compatible.applicationId,
                method: abis_1.arc62Abi.getMethodByName('arc62_get_circulating_supply'),
                methodArgs: [assetId],
                sender: const_1.READ_ACCOUNT,
                suggestedParams,
                signer: algosdk_1.default.makeEmptyTransactionSigner(),
            });
            const simulateResult = await atc.simulate(algodClient, const_1.simulateRequest);
            const returnValue = simulateResult.methodResults[0].returnValue;
            return Number(returnValue);
        }
        else {
            const assetInfo = await algodClient.getAssetByID(assetId).do();
            const reserve = assetInfo.params.reserve;
            const totalAmount = assetInfo.params.total;
            const burnedAmount = await arc54_1.Arc54.getBurnedAmount(network, assetId);
            const reserveAmount = reserve
                ? ((await algodClient.accountAssetInformation(reserve, assetId).do())
                    .assetHolding?.amount ?? 0n)
                : 0n;
            return Number(totalAmount - burnedAmount - reserveAmount);
        }
    }
}
exports.Arc62 = Arc62;
//# sourceMappingURL=arc62.js.map