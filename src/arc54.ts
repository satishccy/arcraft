import algosdk, { getApplicationAddress, TransactionSigner } from 'algosdk';
import { Network } from './types';
import { getAlgodClient } from './utils';
import { arc54Abi } from './abis';

/**
 * The Arc54 class provides methods for interacting with the ARC54 contract.
 */
export class Arc54 {
  /**
   * Get the application ID and address for the ARC54 contract on a given network.
   * @param network The network to use.
   * @returns An object containing the application ID and address.
   */
  static getAppInfo(network: Network) {
    const appId = network === 'mainnet' ? 1257620981 : 497806551;
    const appAddress = getApplicationAddress(appId);
    return {
      appId,
      appAddress,
    };
  }

  /**
   * Check if an address is opted into a specific asset.
   * @param network The network to use.
   * @param assetId The ID of the asset to check.
   * @param address The address to check.
   * @returns A boolean indicating whether the address is opted in.
   */
  static async isOptedIn(network: Network, assetId: number, address: string) {
    const algodClient = getAlgodClient(network);
    try {
      await algodClient.accountAssetInformation(address, assetId).do();
    } catch {
      return false;
    }
    return true;
  }

  /**
   * Burn a specific amount of an asset.
   * @param network The network to use.
   * @param assetId The ID of the asset to burn.
   * @param amount The amount of the asset to burn.
   * @param sender The sender's address and signer.
   * @returns The transaction ID.
   */
  static async burnAsset(
    network: Network,
    assetId: number,
    amount: number,
    sender: { address: string; signer: TransactionSigner }
  ) {
    const algodClient = getAlgodClient(network);
    const appInfo = this.getAppInfo(network);
    const suggestedParams = await algodClient.getTransactionParams().do();
    const atc = new algosdk.AtomicTransactionComposer();
    const accountInfo = await algodClient
      .accountInformation(sender.address)
      .do();
    const availableBalance =
      accountInfo.amount - accountInfo.minBalance > 0n
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
    await algosdk.waitForConfirmation(
      algodClient,
      result[result.length - 1],
      3
    );
    return result[result.length - 1];
  }

  /**
   * Get the total amount of a specific asset that has been burned.
   * @param network The network to use.
   * @param assetId The ID of the asset to check.
   * @returns The total amount of the asset that has been burned.
   */
  static async getBurnedAmount(network: Network, assetId: number) {
    try {
      const algodClient = getAlgodClient(network);
      const appInfo = this.getAppInfo(network);
      const assetAmount = await algodClient
        .accountAssetInformation(appInfo.appAddress, assetId)
        .do();
      return assetAmount?.assetHolding?.amount ?? 0n;
    } catch {
      return 0n;
    }
  }
}
