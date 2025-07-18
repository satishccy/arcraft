/**
 * Implementation of the Algorand ARC-19 standard for NFTs.
 * @module arc19
 */

import algosdk, {
  ALGORAND_ZERO_ADDRESS_STRING,
  AtomicTransactionComposer,
  TransactionSigner,
} from 'algosdk';
import { AssetParams } from 'algosdk/dist/types/client/v2/algod/models/types';
import { lookup as mimeTypeLookup, lookupFromFile } from './mimeUtils';
import fs from 'fs';

import { CID, CIDVersion } from 'multiformats/cid';
import * as digest from 'multiformats/hashes/digest';
import { IPFS } from './ipfs';
import {
  getAlgodClient,
  getIndexerClient,
  calculateSHA256,
  UniversalBuffer,
} from './utils';
import { IPFS_GATEWAY } from './const';
import { CoreAsset } from './coreAsset';
import { Network } from './types';

/**
 * Class representing an ARC-19 compliant NFT on Algorand.
 * Extends CoreAsset with metadata handling for the ARC-19 standard.
 */
export class Arc19 extends CoreAsset {
  /** The metadata associated with this ARC-19 asset */
  public metadata: any;

  /**
   * Creates an instance of Arc19.
   * @param id - The asset ID
   * @param params - The asset parameters from the Algorand blockchain
   * @param network - The Algorand network this asset exists on
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
   * Resolves template-ipfs URLs to standard IPFS URLs using reserve address
   * Handles the ARC-19 template format: template-ipfs://{ipfscid:1:raw:reserve:sha2-256}
   * @param url - The template-ipfs URL to resolve
   * @param reserveAddr - The reserve address to use for CID generation
   * @returns The resolved IPFS URL or empty string if invalid
   */
  static resolveUrl(url: string, reserveAddr: string): string {
    let chunks = url.split('://');
    // Check if prefix is template-ipfs and if {ipfscid:..} is where CID would normally be
    if (chunks[0] === 'template-ipfs' && chunks[1].startsWith('{ipfscid:')) {
      // Look for something like: template:ipfs://{ipfscid:1:raw:reserve:sha2-256} and parse into components
      const cidComponents = chunks[1].split(':');
      if (cidComponents.length !== 5) {
        return '';
      }
      const [, cidVersion, cidCodec, asaField, cidHash] = cidComponents;
      if (cidHash.split('}')[0] !== 'sha2-256') {
        return '';
      }
      if (
        cidCodec !== 'raw' &&
        cidCodec !== 'dag-pb' &&
        cidCodec !== 'dag-cbor'
      ) {
        return '';
      }
      if (asaField !== 'reserve') {
        return '';
      }

      let cidCodecCode = 0x0;
      if (cidCodec === 'raw') {
        cidCodecCode = 0x55;
      } else if (cidCodec === 'dag-pb') {
        cidCodecCode = 0x70;
      } else if (cidCodec === 'dag-cbor') {
        cidCodecCode = 0x71;
      }

      // get 32 bytes Uint8Array reserve address - treating it as 32-byte sha2-256 hash
      const addr = algosdk.decodeAddress(reserveAddr);
      const mhdigest = digest.create(0x12, addr.publicKey);

      const cid = CID.create(
        parseInt(cidVersion) as CIDVersion,
        cidCodecCode,
        mhdigest
      );
      const ipfsCid =
        cid.toString() + '/' + chunks[1].split('/').slice(1).join('/');

      return `${IPFS_GATEWAY}${ipfsCid}`;
    } else {
      return '';
    }
  }

  /**
   * Creates an Arc19 instance from an existing asset ID
   * @param id - The asset ID to load
   * @param network - The Algorand network to use
   * @returns A promise resolving to an Arc19 instance
   * @throws Error if the asset cannot be loaded
   */
  static async fromId(id: number, network: Network): Promise<Arc19> {
    const asset = await CoreAsset.fromId(id, network);
    let metadata = {};

    try {
      const metadataUrl = Arc19.resolveUrl(asset.getUrl(), asset.getReserve());
      const response = await fetch(metadataUrl);
      metadata = await response.json();
    } catch (e) {
      // Metadata fetch failed, use empty object
    }

    return new Arc19(id, asset.assetParams, network, metadata);
  }

  /**
   * Creates an Arc19 instance from existing asset parameters
   * @param id - The asset ID
   * @param assetParams - The asset parameters from the blockchain
   * @param network - The Algorand network to use
   * @returns A promise resolving to an Arc19 instance
   */
  static async fromAssetParams(
    id: number,
    assetParams: AssetParams,
    network: Network
  ): Promise<Arc19> {
    let metadata = {};
    try {
      const metadataUrl = Arc19.resolveUrl(
        assetParams.url || '',
        assetParams.reserve || ''
      );
      const response = await fetch(metadataUrl);
      metadata = await response.json();
    } catch (e) {
      // Metadata fetch failed, use empty object
    }
    return new Arc19(id, assetParams, network, metadata);
  }

  /**
   * Validates if a URL conforms to ARC-19 template-ipfs format
   * @param url - The URL to validate
   * @returns True if the URL is valid ARC-19 template format
   */
  static hasValidUrl(url: string): boolean {
    if (!url) {
      return false;
    }

    if (!url.startsWith('template-ipfs://')) {
      return false;
    }

    const chunks = url.split('://');
    if (chunks.length < 1) {
      return false;
    }
    if (!chunks[1].startsWith('{ipfscid:')) {
      return false;
    }

    const cidComponents = chunks[1].split(':');

    if (cidComponents.length !== 5) {
      return false;
    }

    const [, , cidCodec, asaField, cidHash] = cidComponents;

    if (cidHash.split('}')[0] !== 'sha2-256') {
      return false;
    }
    if (
      cidCodec !== 'raw' &&
      cidCodec !== 'dag-pb' &&
      cidCodec !== 'dag-cbor'
    ) {
      return false;
    }

    if (asaField !== 'reserve') {
      return false;
    }

    return true;
  }

  /**
   * Checks if an asset is ARC-19 compliant based on its URL
   * @param url - The asset URL to check
   * @returns True if the asset follows ARC-19 standards
   */
  static isArc19(url: string): boolean {
    return Arc19.hasValidUrl(url);
  }

  /**
   * Calculates SHA256 hash of blob content
   * @param blobContent - The blob content to hash
   * @returns Promise resolving to hex-encoded hash string
   * @throws Error if no blob content provided
   * @private
   */
  private static async calculateSHA256(
    blobContent: Blob | undefined
  ): Promise<string> {
    if (!blobContent) {
      throw Error('No Blob found in calculateSHA256');
    }
    try {
      const buffer = await blobContent.arrayBuffer();
      return await calculateSHA256(buffer);
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Converts numeric codec code to string representation
   * @param code - The numeric codec code
   * @returns The string representation of the codec
   * @private
   */
  private static codeToCodec(code: number) {
    switch (code.toString(16)) {
      case '55':
        return 'raw';
      case '70':
        return 'dag-pb';
      case '71':
        return 'dag-cbor';
      default:
        throw new Error('Unknown codec');
    }
  }

  /**
   * Creates a reserve address from an IPFS CID for ARC-19 template resolution
   * @param ipfsCid - The IPFS CID to convert
   * @returns The Algorand address derived from the CID
   * @private
   */
  private static createReserveAddressFromIpfsCid(ipfsCid: string) {
    const decoded = CID.parse(ipfsCid);
    const version = decoded.version;
    const codec = this.codeToCodec(decoded.code);

    const assetURL = `template-ipfs://{ipfscid:${version}:${codec}:reserve:sha2-256}`;

    const reserveAddress = algosdk.encodeAddress(
      Uint8Array.from(UniversalBuffer.from(decoded.multihash.digest))
    );

    return { assetURL, reserveAddress };
  }

  /**
   * Resolves standard URLs (HTTP/HTTPS and IPFS)
   * @param url - The URL to resolve
   * @returns The resolved URL with proper protocol
   * @private
   */
  private static resolveNormalUrl(url: string): string {
    if (url.startsWith('https://') || url.startsWith('http://')) {
      return url;
    } else if (url.startsWith('ipfs://')) {
      return `${IPFS_GATEWAY}${url.slice(7)}`;
    } else {
      return '';
    }
  }

  /**
   * Gets the metadata associated with this ARC-19 asset
   * @returns The metadata object
   */
  getMetadata(): any {
    return this.metadata;
  }

  /**
   * Gets the image URL for this ARC-19 asset
   * @returns The resolved image URL
   */
  getImageUrl(): string {
    if (!this.metadata.image) {
      return '';
    }
    return Arc19.resolveNormalUrl(this.metadata.image);
  }

  /**
   * Gets the image as a base64 encoded string
   * @returns A promise resolving to the base64 encoded image
   * @throws Error if no image is available or fetch fails
   */
  async getImageBase64(): Promise<string> {
    if (!this.metadata.image) {
      return '';
    }
    const imageUrl = Arc19.resolveNormalUrl(this.metadata.image);
    const imageResponse = await fetch(imageUrl);
    const imageBlob = await imageResponse.blob();
    const imageBuffer = await imageBlob.arrayBuffer();
    const imageBase64 = UniversalBuffer.from(imageBuffer).toString('base64');
    return imageBase64;
  }

  /**
   * Creates a new ARC-19 compliant NFT on the Algorand blockchain
   * @param options - The configuration options for creating the ARC-19 NFT
   * @returns A promise resolving to an object containing the transaction ID and asset ID
   * @throws Error if creation fails
   */
  static create = async ({
    name,
    unitName,
    creator,
    ipfs,
    image,
    properties,
    network,
    defaultFrozen = false,
    manager = undefined,
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
    /** The freeze address */
    freeze?: string;
    /** The clawback address */
    clawback?: string;
    /** The total number of assets */
    total?: number;
    /** The decimals for the asset */
    decimals?: number;
  }) => {
    // Upload image to IPFS
    let imageCid: string;
    if (typeof image.file === 'string') {
      imageCid = await ipfs.upload(image.file, image.name);
    } else {
      imageCid = await ipfs.upload(image.file, image.name);
    }

    const mimeType =
      typeof image.file === 'string'
        ? mimeTypeLookup(image.name)
        : lookupFromFile(image.file);
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
    const hash = await this.calculateSHA256(blob);

    const metadata = {
      name: name,
      unitName: unitName,
      creator: creator.address,
      image: 'ipfs://' + imageCid,
      image_integrity: `sha256-${hash}`,
      image_mimetype: mimeType,
      properties: properties,
    };

    const metadataCid = await ipfs.uploadJson(metadata, 'metadata.json');

    const { assetURL, reserveAddress } =
      this.createReserveAddressFromIpfsCid(metadataCid);

    const algodClient = getAlgodClient(network);
    const suggestedParams = await algodClient.getTransactionParams().do();
    const atc = new AtomicTransactionComposer();
    atc.addTransaction({
      txn: algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
        sender: creator.address,
        suggestedParams,
        defaultFrozen: defaultFrozen,
        unitName: unitName,
        assetName: name,
        manager: creator.address,
        reserve: reserveAddress,
        freeze: freeze,
        clawback: clawback,
        assetURL: assetURL,
        total: total,
        decimals: decimals,
      }),
      signer: creator.signer,
    });
    const result = await atc.submit(algodClient);
    const txnStatus = await algosdk.waitForConfirmation(
      algodClient,
      result[0],
      3
    );
    return {
      transactionId: result[0],
      assetId: Number(txnStatus.assetIndex || 0),
    };
  };

  /**
   * Updates an existing ARC-19 NFT's metadata
   * @param options - The configuration options for updating the ARC-19 NFT
   * @returns A promise resolving to the transaction confirmation
   * @throws Error if update fails or manager doesn't have permission
   */
  static update = async ({
    manager,
    properties,
    image,
    assetId,
    ipfs,
    network,
  }: {
    /** The manager account with address and transaction signer */
    manager: { address: string; signer: TransactionSigner };
    /** The new properties to set in the metadata */
    properties?: any;
    /** The new image to upload and set */
    image?: {
      file: string | File;
      name: string;
    };
    /** The asset ID of the NFT to update */
    assetId: number;
    /** IPFS instance for uploading content */
    ipfs: IPFS;
    /** The Algorand network the NFT exists on */
    network: Network;
  }): Promise<{
    confirmedRound: bigint | undefined;
    transactionId: string;
  }> => {
    let metadata_url = '';
    const indexerClient = getIndexerClient(network);
    var indexer_result = await indexerClient
      .lookupAssetByID(Number(assetId))
      .do();
    if (manager.address !== indexer_result.asset.params.manager) {
      throw new Error('You are not the manager of the NFT');
    }
    if (
      indexer_result.asset.params.url &&
      Arc19.hasValidUrl(indexer_result.asset.params.url)
    ) {
      metadata_url = Arc19.resolveUrl(
        indexer_result.asset.params.url,
        indexer_result.asset.params.reserve || ''
      );
      if (metadata_url === '') {
        throw new Error('Unable to resolve ipfs url');
      }
    } else {
      throw new Error('Not a Mutable NFT');
    }

    const metadata_res: any = await fetch(metadata_url);
    const metadata = await metadata_res.json();

    if (image) {
      const mimeType =
        typeof image.file === 'string'
          ? mimeTypeLookup(image.name)
          : lookupFromFile(image.file);
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
      const hash = await this.calculateSHA256(blob);
      let imageCid: string;
      if (typeof image.file === 'string') {
        imageCid = await ipfs.upload(image.file, image.name);
      } else {
        imageCid = await ipfs.upload(image.file, image.name);
      }
      metadata.image = `ipfs://${imageCid}`;
      metadata.image_integrity = `sha256-${hash}`;
      metadata.image_mimetype = mimeType;
    }

    // adding owner
    if (properties) {
      metadata.properties = properties;
    }

    if (image || properties) {
      const metadataCid = await ipfs.uploadJson(metadata, 'metadata.json');
      const { assetURL, reserveAddress } =
        this.createReserveAddressFromIpfsCid(metadataCid);

      const algodClient = getAlgodClient(network);
      const suggestedParams = await algodClient.getTransactionParams().do();
      const atc = new AtomicTransactionComposer();
      atc.addTransaction({
        txn: algosdk.makeAssetConfigTxnWithSuggestedParamsFromObject({
          sender: manager.address,
          suggestedParams: suggestedParams,
          manager: manager.address,
          freeze: indexer_result.asset.params.freeze
            ? indexer_result.asset.params.freeze ===
              ALGORAND_ZERO_ADDRESS_STRING
              ? undefined
              : indexer_result.asset.params.freeze
            : undefined,
          clawback: indexer_result.asset.params.clawback
            ? indexer_result.asset.params.clawback ===
              ALGORAND_ZERO_ADDRESS_STRING
              ? undefined
              : indexer_result.asset.params.clawback
            : undefined,
          reserve: reserveAddress,
          assetIndex: Number(assetId),
          strictEmptyAddressChecking: false,
        }),
        signer: manager.signer,
      });
      const result = await atc.submit(algodClient);
      const txnStatus = await algosdk.waitForConfirmation(
        algodClient,
        result[0],
        3
      );
      return {
        confirmedRound: txnStatus.confirmedRound,
        transactionId: result[0],
      };
    } else {
      throw new Error('No changes to update');
    }
  };

  /**
   * Gets all metadata versions for an ARC-19 asset by examining transaction history
   * @param assetId - The asset ID to get metadata versions for
   * @param network - The Algorand network to search on
   * @returns Promise resolving to array of metadata versions with timestamps
   * @throws Error if unable to fetch transaction history
   */
  static getMetadataVersions = async (assetId: number, network: Network) => {
    const indexerClient = getIndexerClient(network);
    var assets_txns = await indexerClient
      .searchForTransactions()
      .assetID(assetId)
      .txType('acfg')
      .do();
    var url = '';
    const metadatas: Record<string, any>[] = [];
    for (var i = 0; i < assets_txns.transactions.length; i++) {
      try {
        if (i == 0) {
          url =
            assets_txns.transactions[i].assetConfigTransaction?.params?.url ||
            '';
        }
        var round = assets_txns.transactions[i].confirmedRound || 0;
        var metadata_url = this.resolveUrl(
          url,
          assets_txns.transactions[i].assetConfigTransaction?.params?.reserve ||
            ''
        );
        var metadata_res: any = await fetch(metadata_url);
        var metadata = await metadata_res.json();
        var m: Record<string, any> = {};
        m[round.toString()] = metadata;
        metadatas.push(m);
      } catch (e) {
        console.error(e);
      }
    }
    while (true) {
      if (assets_txns.nextToken) {
        var assets_txns = await indexerClient
          .searchForTransactions()
          .assetID(assetId)
          .txType('acfg')
          .nextToken(assets_txns.nextToken)
          .do();
        for (var i = 0; i < assets_txns.transactions.length; i++) {
          try {
            if (i == 0) {
              url =
                assets_txns.transactions[i].assetConfigTransaction?.params
                  ?.url || '';
            }
            var round = assets_txns.transactions[i].confirmedRound || 0;
            var metadata_url = this.resolveUrl(
              url,
              assets_txns.transactions[i].assetConfigTransaction?.params
                ?.reserve || ''
            );
            var metadata_res: any = await fetch(
              metadata_url
            );
            var metadata = await metadata_res.json();
            var m: Record<string, any> = {};
            m[round.toString()] = metadata;
            metadatas.push(m);
          } catch (e) {
            console.error(e);
          }
        }
      } else {
        break;
      }
    }
    return metadatas;
  };

  /**
   * Gets the metadata URL for this ARC-19 asset using the reserve address
   * @returns The resolved metadata URL
   */
  getMetadataUrl(): string {
    const reserve = this.getReserve();
    const url = this.getUrl();

    if (!reserve || !url) {
      return '';
    }

    const chunks = url.split('://');
    const cidComponents = chunks[1].split(':');
    const [, cidVersion, cidCodec] = cidComponents;

    let cidCodecCode;
    if (cidCodec === 'raw') {
      cidCodecCode = 0x55;
    } else if (cidCodec === 'dag-pb') {
      cidCodecCode = 0x70;
    } else {
      return '';
    }

    const address = algosdk.decodeAddress(reserve);
    const mhdigest = digest.create(0x12, address.publicKey);
    const cid = CID.create(
      parseInt(cidVersion) as CIDVersion,
      cidCodecCode,
      mhdigest
    );

    return (
      IPFS_GATEWAY +
      cid.toString() +
      '/' +
      chunks[1].split('/').slice(1).join('/')
    );
  }
}
