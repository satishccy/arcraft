/**
 * Implementation of the Algorand ARC-3 standard for NFTs.
 * @module arc3
 */

import { AssetParams } from 'algosdk/dist/types/client/v2/algod/models/types';
import { CoreAsset } from './coreAsset';
import { Network } from './types';
import { IPFS_GATEWAY } from './const';
import algosdk, { TransactionSigner } from 'algosdk';
import { IPFS } from './ipfs';
import mime from 'mime-types';
import crypto from 'crypto';
import { getAlgodClient } from './utils';
import fs from 'fs';

/**
 * Class representing an ARC-3 compliant NFT on Algorand.
 * Extends CoreAsset with metadata handling for the ARC-3 standard.
 */
class Arc3 extends CoreAsset {
  /** The metadata associated with this ARC-3 asset */
  public metadata: any;

  /**
   * Creates an instance of Arc3.
   * @param id - The asset ID
   * @param params - The asset parameters from the Algorand blockchain
   * @param metadata - The metadata associated with the asset
   */
  private constructor(
    id: number,
    params: AssetParams,
    network: Network,
    metadata: any
  ) {
    super(id, params, network);
    this.metadata = metadata;
  }

  /**
   * Fetches metadata from a given URL
   * @param url - The URL to fetch metadata from
   * @returns A promise resolving to the metadata object
   */
  private static async fetchMetadata(url: string): Promise<any> {
    try {
      const metadataResponse = await fetch(url);
      return metadataResponse.json();
    } catch (error) {
      return undefined;
    }
  }

  /**
   * Resolves URLs, handling IPFS protocol and ID replacements
   * @param url - The URL to resolve
   * @param id - The asset ID to replace in the URL if needed
   * @returns The resolved URL
   */
  static resolveUrl(url: string, id: number): string {
    let resolvedUrl = url;
    if (url.includes('{id}')) {
      resolvedUrl = url.replace('{id}', id.toString());
    }
    if (
      resolvedUrl.startsWith('https://') ||
      resolvedUrl.startsWith('http://')
    ) {
      return resolvedUrl;
    } else if (resolvedUrl.startsWith('ipfs://')) {
      return `${IPFS_GATEWAY}${resolvedUrl.slice(7)}`;
    } else {
      return '';
    }
  }

  /**
   * Creates an Arc3 instance from an existing asset ID
   * @param id - The asset ID to load
   * @param network - The Algorand network to use
   * @returns A promise resolving to an Arc3 instance
   */
  static async fromId(id: number, network: Network): Promise<Arc3> {
    const asset = await CoreAsset.fromId(id, network);
    let metadata = {};
    try {
      const resolvedUrl = this.resolveUrl(asset.getUrl(), id);
      metadata = await this.fetchMetadata(resolvedUrl);
    } catch (e) {
      // Metadata fetch failed, use empty object
    }
    return new Arc3(id, asset.assetParams, network, metadata);
  }

  static async fromAssetParams(
    id: number,
    assetParams: AssetParams,
    network: Network
  ): Promise<Arc3> {
    let metadata = {};
    try {
      const resolvedUrl = this.resolveUrl(assetParams.url || '', id);
      metadata = await this.fetchMetadata(resolvedUrl);
    } catch (e) {
      // Metadata fetch failed, use empty object
    }
    return new Arc3(id, assetParams, network, metadata);
  }

  /**
   * Checks if the asset has a valid ARC-3 name
   * @returns True if the asset name is ARC-3 compliant
   */
  static hasValidName(name: string): boolean {
    if (!name) {
      return false;
    }
    if (name.toLowerCase() == 'arc3') {
      return true;
    } else if (name.toLowerCase().endsWith('arc3')) {
      return true;
    }
    return false;
  }

  /**
   * Checks if the asset has a valid ARC-3 URL
   * @returns True if the asset URL is ARC-3 compliant
   */
  static hasValidUrl(url: string, id: number): boolean {
    if (!url) {
      return false;
    }
    const resolvedUrl = Arc3.resolveUrl(url, id);
    if (resolvedUrl.toLowerCase().endsWith('#arc3')) {
      return true;
    }
    return false;
  }

  /**
   * Checks if the asset is ARC-3 compliant
   * @returns True if the asset is ARC-3 compliant
   */
  static isArc3(name: string, url: string, id: number): boolean {
    if (!name || !url) {
      return false;
    }
    return Arc3.hasValidName(name) || Arc3.hasValidUrl(url, id);
  }

  /**
   * Gets the metadata associated with the asset
   * @returns The metadata object
   */
  getMetadata(): any {
    return this.metadata;
  }

  /**
   * Gets the metadata URL for this ARC-3 asset
   * @returns The resolved metadata URL
   */
  getMetadataUrl(): string {
    return Arc3.resolveUrl(this.metadata.image, this.id);
  }

  /**
   * Gets the image associated with the asset
   * @returns The image object
   */
  getImageUrl(): string {
    if (!this.metadata.image) {
      return '';
    }
    return Arc3.resolveUrl(this.metadata.image, this.id);
  }

  /**
   * Gets the image as a base64 encoded string
   * @returns A promise resolving to the base64 encoded image
   */
  async getImageBase64(): Promise<string> {
    if (!this.metadata.image) {
      return '';
    }
    const imageUrl = Arc3.resolveUrl(this.metadata.image, this.id);
    const imageResponse = await fetch(imageUrl);
    const imageBlob = await imageResponse.blob();
    const imageBuffer = await imageBlob.arrayBuffer();
    const imageBase64 = Buffer.from(imageBuffer).toString('base64');
    return imageBase64;
  }

  /**
   * Creates a new ARC-3 compliant NFT on the Algorand blockchain
   * @param options - The configuration options for the NFT
   * @returns A promise resolving to an object containing the transaction ID and asset ID
   */
  static async create({
    name,
    unitName,
    creator,
    ipfs,
    image,
    properties,
    network,
    defaultFrozen = false,
    manager = undefined,
    reserve = undefined,
    freeze = undefined,
    clawback = undefined,
    total = 1,
    decimals = 0,
  }: {
    /** The name of the asset */
    name: string;
    /** The unit name for the asset */
    unitName: string;
    /** The creator of the asset, including address and signer */
    creator: { address: string; signer: TransactionSigner };
    /** The IPFS instance to use for uploading */
    ipfs: IPFS;
    /** The path to the image file */
    image: {
      file: string | File;
      name: string;
    };
    /** Additional properties to include in the metadata */
    properties: any;
    /** The Algorand network to use */
    network: Network;
    /** Whether the asset should be frozen by default */
    defaultFrozen?: boolean;
    /** The manager address */
    manager?: string;
    /** The reserve address */
    reserve?: string;
    /** The freeze address */
    freeze?: string;
    /** The clawback address */
    clawback?: string;
    /** The total number of assets */
    total?: number;
    /** The decimals for the asset */
    decimals?: number;
  }) {
    // Upload image to IPFS
    let imageCid: string;
    if (typeof image.file === 'string') {
      imageCid = await ipfs.upload(image.file, image.name);
    } else {
      imageCid = await ipfs.upload(image.file, image.name);
    }

    const mimeType = mime.lookup(image.name) || 'application/octet-stream';

    let blob: Blob;
    if (typeof image.file === 'string') {
      blob = new Blob([await fs.promises.readFile(image.file)], {
        type: mimeType,
      });
    } else {
      blob = new Blob([await image.file.arrayBuffer()], {
        type: mimeType,
      });
    }

    // Calculate SHA256 hash for image integrity
    const imageHash = await this.calculateSHA256(blob);

    // Create ARC-3 compliant metadata
    const metadata = {
      name: name,
      unit_name: unitName,
      creator: creator.address,
      image: `ipfs://${imageCid}#arc3`,
      image_integrity: `sha256-${imageHash}`,
      image_mimetype: mimeType,
      properties: properties,
    };

    // Upload metadata to IPFS
    const metadataCid = await ipfs.uploadJson(metadata, 'metadata.json');

    // Create the asset on the blockchain
    const client = getAlgodClient(network);
    const sp = await client.getTransactionParams().do();
    const nft_txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
      sender: creator.address,
      suggestedParams: sp,
      defaultFrozen: defaultFrozen,
      unitName: unitName,
      assetName: name,
      manager: manager,
      reserve: reserve,
      freeze: freeze,
      clawback: clawback,
      assetURL: `ipfs://${metadataCid}#arc3`,
      total: total,
      decimals: decimals,
    });

    // Sign and send the transaction
    const signed = await creator.signer([nft_txn], [0]);
    const txid = await client.sendRawTransaction(signed[0]).do();
    const result = await algosdk.waitForConfirmation(client, txid.txid, 3);

    return {
      transactionId: txid.txid,
      assetId: Number(result.assetIndex || 0),
    };
  }

  /**
   * Calculates the SHA256 hash of a file's content
   * @param blobContent - The file content as a Blob
   * @returns A promise resolving to the hex-encoded hash
   * @private
   */
  private static async calculateSHA256(
    blobContent: Blob | undefined
  ): Promise<string> {
    if (!blobContent) {
      throw Error('No Blob found in calculateSHA256');
    }
    try {
      var buffer = Buffer.from(await blobContent.arrayBuffer());
      const hash = crypto.createHash('sha256');
      hash.update(buffer);
      return hash.digest('hex');
    } catch (error: any) {
      throw error;
    }
  }
}

export { Arc3 };
