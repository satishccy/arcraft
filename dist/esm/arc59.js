import algosdk, { AtomicTransactionComposer, getApplicationAddress, } from 'algosdk';
import { getAlgodClient } from './utils';
import { READ_ACCOUNT, simulateRequest } from './const';
import { arc59Abi } from './abis';
/**
 * Utilities for interacting with the ARC-59 Router smart contract on Algorand.
 *
 * @remarks
 * ARC-59 defines an inbox-based routing scheme for ASAs. This class composes
 * transactions to send assets to a router, and for receivers to claim or reject
 * assets from their ARC-59 inbox. Read-only methods leverage simulation to
 * query contract state without sending transactions.
 */
export class Arc59 {
    /**
     * Resolve the ARC-59 router application ID and address for a given network.
     *
     * @param network - Target network, e.g. `'mainnet'` or `'testnet'`.
     * @returns Object containing `appId` and `appAddress`.
     * @example
     * ```ts
     * const { appId, appAddress } = Arc59.getAppInfo('testnet');
     * console.log(appId, appAddress);
     * ```
     */
    static getAppInfo(network) {
        const appId = network === 'mainnet' ? 2449590623 : 643020148;
        const appAddress = getApplicationAddress(appId);
        return {
            appId,
            appAddress,
        };
    }
    /**
     * Simulate the send flow and fetch information required to send an asset via ARC-59.
     *
     * @param network - Target network.
     * @param assetId - ASA identifier to send.
     * @param receiver - Receiver's Algorand address.
     * @returns Simulation result including:
     * - `itxns`: total inner transactions expected
     * - `mbr`: minimum balance requirement to cover during the send
     * - `routerOptedIn`: whether the router is opted into the asset
     * - `receiverOptedIn`: whether the receiver is opted into the asset
     * - `receiverAlgoNeededForClaim`: ALGO needed by receiver to claim (in microalgos)
     * @throws Error if simulation fails or no return value is produced.
     * @example
     * ```ts
     * const info = await Arc59.getAssetSendInfo('testnet', 12345, receiverAddr);
     * if (!info.receiverOptedIn) {
     *   // compose routed send using Arc59.sendAsset
     * }
     * ```
     */
    static async getAssetSendInfo(network, assetId, receiver) {
        const algodClient = getAlgodClient(network);
        const suggestedParams = await algodClient.getTransactionParams().do();
        const atc = new algosdk.AtomicTransactionComposer();
        const appInfo = this.getAppInfo(network);
        atc.addMethodCall({
            appID: appInfo.appId,
            method: arc59Abi.getMethodByName('arc59_getSendAssetInfo'),
            methodArgs: [receiver, assetId],
            sender: READ_ACCOUNT,
            suggestedParams,
            signer: algosdk.makeEmptyTransactionSigner(),
        });
        const simulateResult = await atc.simulate(algodClient, simulateRequest);
        const returnValue = simulateResult.methodResults[0].returnValue;
        if (!returnValue) {
            throw new Error('Failed to get asset send info');
        }
        const [itxns, mbr, routerOptedIn, receiverOptedIn, receiverAlgoNeededForClaim,] = returnValue;
        return {
            itxns,
            mbr,
            routerOptedIn,
            receiverOptedIn,
            receiverAlgoNeededForClaim,
        };
    }
    /**
     * Check if an address is opted-in to a given ASA.
     *
     * @param network - Target network.
     * @param assetId - ASA identifier.
     * @param address - Account address to check.
     * @returns `true` if the account is opted-in, otherwise `false`.
     * @example
     * ```ts
     * const opted = await Arc59.isOptedIn('testnet', 12345, addr);
     * ```
     */
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
    /**
     * Get the ARC-59 inbox address for a receiver.
     *
     * @param network - Target network.
     * @param receiver - Receiver's Algorand address.
     * @returns The inbox account address, or the zero address if not created.
     * @throws Error if simulation does not return an inbox address.
     * @example
     * ```ts
     * const inbox = await Arc59.getInboxAddress('testnet', receiverAddr);
     * ```
     */
    static async getInboxAddress(network, receiver) {
        const algodClient = getAlgodClient(network);
        const appInfo = this.getAppInfo(network);
        const atc = new AtomicTransactionComposer();
        atc.addMethodCall({
            appID: appInfo.appId,
            method: arc59Abi.getMethodByName('arc59_getInbox'),
            methodArgs: [receiver],
            sender: READ_ACCOUNT,
            suggestedParams: await algodClient.getTransactionParams().do(),
            signer: algosdk.makeEmptyTransactionSigner(),
        });
        const simulateResult = await atc.simulate(algodClient, simulateRequest);
        const returnValue = simulateResult.methodResults[0].returnValue;
        if (!returnValue) {
            throw new Error('Failed to get inbox address');
        }
        return returnValue;
    }
    /**
     * Send an ASA to a receiver using ARC-59.
     *
     * If the receiver is already opted-in, a direct transfer is submitted. Otherwise,
     * a composed transaction group routes the asset through the ARC-59 router so the
     * receiver can later claim it from their inbox.
     *
     * @param params - Send parameters.
     * @param params.network - Target network.
     * @param params.assetId - ASA identifier to send.
     * @param params.amount - Amount to send (base units).
     * @param params.receiver - Receiver account address.
     * @param params.sender - Sender address and signer for authorizing transactions.
     * @returns The transaction ID of the submitted group (last tx for routed send, or lone transfer tx for direct send).
     * @example
     * ```ts
     * const txId = await Arc59.sendAsset({
     *   network: 'testnet',
     *   assetId: 12345,
     *   amount: 10,
     *   receiver: receiverAddr,
     *   sender: { address: senderAddr, signer }
     * });
     * ```
     */
    static async sendAsset({ network, assetId, amount, receiver, sender, }) {
        const algodClient = getAlgodClient(network);
        const appInfo = this.getAppInfo(network);
        const sendInfo = await this.getAssetSendInfo(network, assetId, receiver);
        const suggestedParams = await algodClient.getTransactionParams().do();
        if (sendInfo.receiverOptedIn) {
            const atc = new AtomicTransactionComposer();
            atc.addTransaction({
                txn: algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                    sender: sender.address,
                    suggestedParams,
                    assetIndex: assetId,
                    receiver: receiver,
                    amount: amount,
                }),
                signer: sender.signer,
            });
            const result = await atc.submit(algodClient);
            const txnStatus = await algosdk.waitForConfirmation(algodClient, result[0], 3);
            return result[0];
        }
        sendInfo.receiverAlgoNeededForClaim =
            sendInfo.receiverAlgoNeededForClaim !== 0n
                ? sendInfo.receiverAlgoNeededForClaim + 5000n
                : 0n;
        const composer = new AtomicTransactionComposer();
        if (sendInfo.mbr > 0n || sendInfo.receiverAlgoNeededForClaim > 0n) {
            const mbrPayment = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
                sender: sender.address,
                suggestedParams,
                amount: sendInfo.mbr + sendInfo.receiverAlgoNeededForClaim,
                receiver: appInfo.appAddress,
            });
            composer.addTransaction({
                txn: mbrPayment,
                signer: sender.signer,
            });
        }
        if (!sendInfo.routerOptedIn) {
            composer.addMethodCall({
                appID: appInfo.appId,
                method: arc59Abi.getMethodByName('arc59_optRouterIn'),
                methodArgs: [assetId],
                sender: sender.address,
                suggestedParams,
                signer: sender.signer,
            });
        }
        const boxes = [algosdk.decodeAddress(receiver).publicKey];
        const inboxAddress = await this.getInboxAddress(network, receiver);
        const axfer = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
            sender: sender.address,
            suggestedParams,
            assetIndex: assetId,
            receiver: appInfo.appAddress,
            amount: amount,
        });
        const axferWithSigner = {
            txn: axfer,
            signer: sender.signer,
        };
        const totalItxns = sendInfo.itxns + (sendInfo.receiverAlgoNeededForClaim === 0n ? 0n : 1n);
        composer.addMethodCall({
            appID: appInfo.appId,
            method: arc59Abi.getMethodByName('arc59_sendAsset'),
            methodArgs: [
                axferWithSigner,
                receiver,
                sendInfo.receiverAlgoNeededForClaim,
            ],
            sender: sender.address,
            suggestedParams: {
                ...suggestedParams,
                fee: 1000 + 1000 * Number(totalItxns),
                flatFee: true,
            },
            boxes: boxes.map((box) => ({
                appIndex: appInfo.appId,
                name: box,
            })),
            appAccounts: [receiver, inboxAddress],
            appForeignAssets: [assetId],
            signer: sender.signer,
        });
        const result = await composer.submit(algodClient);
        await algosdk.waitForConfirmation(algodClient, result[result.length - 1], 3);
        return result[result.length - 1];
    }
    /**
     * List ASA holdings currently held in a receiver's ARC-59 inbox.
     *
     * @param params - Query parameters.
     * @param params.network - Target network.
     * @param params.receiver - Receiver's Algorand address.
     * @returns Array of assets in the inbox with `assetId`, `amount`, and `isFrozen`.
     * @example
     * ```ts
     * const assets = await Arc59.getAssetsInInbox({ network: 'testnet', receiver: addr });
     * ```
     */
    static async getAssetsInInbox({ network, receiver, }) {
        const algodClient = getAlgodClient(network);
        const appInfo = this.getAppInfo(network);
        const inboxAddress = await this.getInboxAddress(network, receiver);
        if (inboxAddress !== algosdk.ALGORAND_ZERO_ADDRESS_STRING) {
            const assets = await algodClient.accountInformation(inboxAddress).do();
            const finalAssets = [];
            assets?.assets?.forEach((asset) => {
                finalAssets.push({
                    assetId: Number(asset.assetId),
                    amount: Number(asset.amount),
                    isFrozen: asset.isFrozen,
                });
            });
            return finalAssets;
        }
        else {
            return [];
        }
    }
    /**
     * Claim a routed ASA from the receiver's ARC-59 inbox.
     *
     * If the receiver lacks the opt-in to the ASA, this method composes the opt-in
     * transaction automatically. If the inbox holds excess ALGO above min-balance,
     * a claim of ALGO is also composed so the fee covers the additional calls.
     *
     * @param params - Claim parameters.
     * @param params.network - Target network.
     * @param params.receiver - Receiver address and signer authorizing the claim.
     * @param params.assetId - ASA identifier to claim.
     * @returns The transaction ID of the submitted claim group.
     * @example
     * ```ts
     * const txId = await Arc59.claimAsset({
     *   network: 'testnet',
     *   receiver: { address: receiverAddr, signer },
     *   assetId: 12345,
     * });
     * ```
     */
    static async claimAsset({ network, receiver, assetId, }) {
        const algodClient = getAlgodClient(network);
        const appInfo = this.getAppInfo(network);
        const suggestedParams = await algodClient.getTransactionParams().do();
        const composer = new AtomicTransactionComposer();
        const inboxAddress = await this.getInboxAddress(network, receiver.address);
        const inboxInfo = await algodClient.accountInformation(inboxAddress).do();
        const isReceiverOptedIn = await this.isOptedIn(network, assetId, receiver.address);
        let totalTxns = 3;
        if (inboxInfo.amount > inboxInfo.minBalance) {
            totalTxns += 2;
            composer.addMethodCall({
                appID: appInfo.appId,
                method: arc59Abi.getMethodByName('arc59_claimAlgo'),
                methodArgs: [],
                sender: receiver.address,
                suggestedParams: {
                    ...suggestedParams,
                    fee: 0,
                    flatFee: true,
                },
                signer: receiver.signer,
            });
        }
        if (!isReceiverOptedIn) {
            composer.addTransaction({
                txn: algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                    sender: receiver.address,
                    receiver: receiver.address,
                    suggestedParams,
                    assetIndex: assetId,
                    amount: 0,
                }),
                signer: receiver.signer,
            });
        }
        composer.addMethodCall({
            appID: appInfo.appId,
            method: arc59Abi.getMethodByName('arc59_claim'),
            methodArgs: [assetId],
            sender: receiver.address,
            suggestedParams: {
                ...suggestedParams,
                fee: 1000 * totalTxns,
                flatFee: true,
            },
            boxes: [
                {
                    appIndex: appInfo.appId,
                    name: algosdk.decodeAddress(receiver.address).publicKey,
                },
            ],
            appAccounts: [receiver.address, inboxAddress],
            appForeignAssets: [assetId],
            signer: receiver.signer,
        });
        const result = await composer.submit(algodClient);
        await algosdk.waitForConfirmation(algodClient, result[result.length - 1], 3);
        return result[result.length - 1];
    }
    /**
     * Reject a routed ASA from the receiver's ARC-59 inbox.
     *
     * @param params - Reject parameters.
     * @param params.network - Target network.
     * @param params.receiver - Receiver address and signer authorizing the rejection.
     * @param params.assetId - ASA identifier to reject.
     * @returns The transaction ID of the submitted reject group.
     * @example
     * ```ts
     * const txId = await Arc59.rejectAsset({
     *   network: 'testnet',
     *   receiver: { address: receiverAddr, signer },
     *   assetId: 12345,
     * });
     * ```
     */
    static async rejectAsset({ network, receiver, assetId, }) {
        const algodClient = getAlgodClient(network);
        const appInfo = this.getAppInfo(network);
        const suggestedParams = await algodClient.getTransactionParams().do();
        const composer = new AtomicTransactionComposer();
        const inboxAddress = await this.getInboxAddress(network, receiver.address);
        const assetInfo = await algodClient.getAssetByID(assetId).do();
        let totalTxns = 3;
        composer.addMethodCall({
            appID: appInfo.appId,
            method: arc59Abi.getMethodByName('arc59_reject'),
            methodArgs: [assetId],
            sender: receiver.address,
            suggestedParams: {
                ...suggestedParams,
                fee: 1000 * totalTxns,
                flatFee: true,
            },
            boxes: [
                {
                    appIndex: appInfo.appId,
                    name: algosdk.decodeAddress(receiver.address).publicKey,
                },
            ],
            appAccounts: [receiver.address, inboxAddress, assetInfo.params.creator],
            appForeignAssets: [assetId],
            signer: receiver.signer,
        });
        const result = await composer.submit(algodClient);
        await algosdk.waitForConfirmation(algodClient, result[result.length - 1], 3);
        return result[result.length - 1];
    }
}
//# sourceMappingURL=arc59.js.map