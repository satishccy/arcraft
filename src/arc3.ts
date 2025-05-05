/**
 * Implementation of the Algorand ARC-3 standard for NFTs.
 * @module arc3
 */

import { AssetParams } from 'algosdk/dist/types/client/v2/algod/models/types';
import { CoreAsset } from './coreAsset';
import { Network } from './types';
import { IPFS_GATEWAY } from './const';
import algosdk, {
  TransactionSigner,
} from 'algosdk';
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
  public metadata: object;

  /**
   * Creates an instance of Arc3.
   * @param id - The asset ID
   * @param params - The asset parameters from the Algorand blockchain
   * @param metadata - The metadata associated with the asset
   */
  private constructor(id: number, params: AssetParams, metadata: object) {
    super(id, params);
    this.metadata = metadata;
  }

  /**
   * Fetches metadata from a given URL
   * @param url - The URL to fetch metadata from
   * @returns A promise resolving to the metadata object
   */
  protected static async fetchMetadata(url: string): Promise<object> {
    try {
      const metadataResponse = await fetch(url);
      return metadataResponse.json();
    } catch (error) {
      return {};
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
    if (resolvedUrl.startsWith('https://')) {
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
    const resolvedUrl = this.resolveUrl(asset.getUrl(), id);
    const metadata = await this.fetchMetadata(resolvedUrl);
    return new Arc3(id, asset.assetParams, metadata);
  }

  /**
   * Checks if the asset has a valid ARC-3 name
   * @returns True if the asset name is ARC-3 compliant
   */
  hasValidName(): boolean {
    if (!this.assetParams.name) {
      return false;
    }
    if (this.assetParams.name.toLowerCase() == 'arc3') {
      return true;
    } else if (this.assetParams.name.toLowerCase().endsWith('arc3')) {
      return true;
    }
    return false;
  }

  /**
   * Checks if the asset has a valid ARC-3 URL
   * @returns True if the asset URL is ARC-3 compliant
   */
  hasValidUrl(): boolean {
    if (!this.assetParams.url) {
      return false;
    }
    const url = Arc3.resolveUrl(this.assetParams.url, this.id);
    if (url.toLowerCase().endsWith('#arc3')) {
      return true;
    }
    return false;
  }

  /**
   * Checks if the asset is ARC-3 compliant
   * @returns True if the asset is ARC-3 compliant
   */
  isArc3(): boolean {
    return this.hasValidName() || this.hasValidUrl();
  }

  /**
   * Gets the metadata associated with the asset
   * @returns The metadata object
   */
  getMetadata(): object {
    return this.metadata;
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
    imageName,
    properties,
    network,
    defaultFrozen = false,
    manager = undefined,
    reserve = undefined,
    freeze = undefined,
    clawback = undefined,
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
    image: string;
    /** The name of the image file */
    imageName: string;
    /** Additional properties to include in the metadata */
    properties: object;
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
  }) {
    // Upload image to IPFS
    const imageCid = await ipfs.upload(image, imageName);
    const mimeType = mime.lookup(imageName) || 'application/octet-stream';
    let blob = new Blob([await fs.promises.readFile(image)], {
      type: mimeType,
    });
    
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
      total: 1,
      decimals: 0,
    });
    
    // Sign and send the transaction
    const signed = await creator.signer([nft_txn], [0]);
    const txid = await client.sendRawTransaction(signed[0]).do();
    const result = await algosdk.waitForConfirmation(client, txid.txid, 3);
    
    return { txid: txid.txid, assetId: result.assetIndex };
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
