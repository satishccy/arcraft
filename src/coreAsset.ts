/* eslint-disable import/no-unresolved */
import { ALGORAND_ZERO_ADDRESS_STRING } from 'algosdk';
import { AssetParams } from 'algosdk/dist/types/client/v2/algod/models/types';
import { Network } from './types';
import { getAlgodClient } from './utils';

export class CoreAsset {
  public id: number;
  public assetParams: AssetParams;

  protected constructor(id: number, assetParams: AssetParams) {
    this.id = id;
    this.assetParams = assetParams;
  }

  static async fromId(id: number, network: Network): Promise<CoreAsset> {
    const assetParams = await this.fetchAssetParams(id, network);
    return new CoreAsset(id, assetParams);
  }

  static async fetchAssetParams(
    id: number,
    network: Network
  ): Promise<AssetParams> {
    const client = getAlgodClient(network);
    const asset = await client.getAssetByID(id).do();
    return asset.params;
  }

  get(): AssetParams {
    return this.assetParams as AssetParams;
  }

  getCreator(): string {
    return this.assetParams.creator;
  }

  getClawback(): string {
    return this.assetParams.clawback ?? ALGORAND_ZERO_ADDRESS_STRING;
  }

  getFreeze(): string {
    return this.assetParams.freeze ?? ALGORAND_ZERO_ADDRESS_STRING;
  }

  getReserve(): string {
    return this.assetParams.reserve ?? ALGORAND_ZERO_ADDRESS_STRING;
  }

  getManager(): string {
    return this.assetParams.manager ?? ALGORAND_ZERO_ADDRESS_STRING;
  }

  hasClawback(): boolean {
    return this.assetParams.clawback !== ALGORAND_ZERO_ADDRESS_STRING;
  }

  hasFreeze(): boolean {
    return this.assetParams.freeze !== ALGORAND_ZERO_ADDRESS_STRING;
  }

  hasReserve(): boolean {
    return this.assetParams.reserve !== ALGORAND_ZERO_ADDRESS_STRING;
  }

  hasManager(): boolean {
    return this.assetParams.manager !== ALGORAND_ZERO_ADDRESS_STRING;
  }

  getIndex(): number {
    return this.id;
  }

  getName(): string {
    return this.assetParams.name ?? '';
  }

  getUnitName(): string {
    return this.assetParams.unitName ?? '';
  }

  getDecimals(): number {
    return this.assetParams.decimals;
  }

  getTotal(): number {
    return Number(this.assetParams.total);
  }

  getTotalSupply(): number {
    return this.getTotal() / 10 ** this.getDecimals();
  }

  getAmountInDecimals(amount: number): number {
    return amount / 10 ** this.getDecimals();
  }

  getAmountInBaseUnits(amount: number): number {
    return amount * 10 ** this.getDecimals();
  }

  getDefaultFrozen(): boolean {
    return this.assetParams.defaultFrozen ?? false;
  }

  getUrl(): string {
    return this.assetParams.url ?? '';
  }

  getMetadataHash(): string {
    const textDecoder = new TextDecoder();
    return textDecoder.decode(
      this.assetParams.metadataHash ?? new Uint8Array()
    );
  }

  getUrlProtocol(): string {
    const url = this.getUrl();
    if (!url) return '';

    const [protocol] = url.split('://');
    return protocol || '';
  }

  hasHttpUrl(): boolean {
    return (
      this.getUrlProtocol() === 'http' || this.getUrlProtocol() === 'https'
    );
  }

  hasIpfsUrl(): boolean {
    return this.getUrlProtocol() === 'ipfs';
  }

  hasTemplateUrl(): boolean {
    return this.getUrlProtocol() === 'template-ipfs';
  }
}
