/**
 * Implementation of the Algorand ARC-19 standard for NFTs.
 * @module arc19
 */

import algosdk, { TransactionSigner } from 'algosdk';
import { AssetParams } from 'algosdk/dist/types/client/v2/algod/models/types';
import axios, { AxiosResponse } from 'axios';
import mime from 'mime-types';
import fs from 'fs';
import crypto from 'crypto';
import * as multiformats from 'multiformats';
import { Version } from 'multiformats/cid';
import { IPFS } from './ipfs';
import { getAlgodClient, getIndexerClient } from './utils';
import { IPFS_GATEWAY } from './const';
import { CoreAsset } from './coreAsset';
import { Network } from './types';

/**
 * Class representing an ARC-19 compliant NFT on Algorand.
 * Extends CoreAsset with metadata handling for the ARC-19 standard.
 */
export class Arc19 extends CoreAsset {
  /** The metadata associated with this ARC-19 asset */
  public metadata: object;

  /**
   * Creates an instance of Arc19.
   * @param id - The asset ID
   * @param params - The asset parameters from the Algorand blockchain
   * @param metadata - The metadata associated with the asset
   */
  private constructor(id: number, params: AssetParams, metadata: object) {
    super(id, params);
    this.metadata = metadata;
  }

  private static resolveProtocol(url: string, reserveAddr: string): string {
    if (url.endsWith('#arc3')) url = url.slice(0, url.length - '#arc3'.length);

    let chunks = url.split('://');
    // Check if prefix is template-ipfs and if {ipfscid:..} is where CID would normally be
    if (chunks[0] === 'template-ipfs' && chunks[1].startsWith('{ipfscid:')) {
      // Look for something like: template:ipfs://{ipfscid:1:raw:reserve:sha2-256} and parse into components
      chunks[0] = 'ipfs';
      const cidComponents = chunks[1].split(':');
      if (cidComponents.length !== 5) {
        // give up
        return url;
      }
      const [, cidVersion, cidCodec, asaField, cidHash] = cidComponents;

      if (cidHash.split('}')[0] !== 'sha2-256') {
        return url;
      }
      if (cidCodec !== 'raw' && cidCodec !== 'dag-pb') {
        return url;
      }
      if (asaField !== 'reserve') {
        return url;
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
      const mhdigest = multiformats.digest.create(0x12, addr.publicKey);

      const cid = multiformats.CID.create(
        parseInt(cidVersion) as Version,
        cidCodecCode,
        mhdigest
      );
      chunks[1] =
        cid.toString() + '/' + chunks[1].split('/').slice(1).join('/');
    }

    // No protocol specified, give up
    if (chunks.length < 2) return url;

    //Switch on the protocol
    switch (chunks[0]) {
      case 'ipfs': //Its ipfs, use the configured gateway
        return 'ipfs://' + chunks[1];
      case 'https': //Its already http, just return it
        return url;
      // TODO: Future options may include arweave or algorand
    }

    return url;
  }

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

  private static createReserveAddressFromIpfsCid(ipfsCid: string) {
    const decoded = multiformats.CID.parse(ipfsCid);
    const version = decoded.version;
    const codec = this.codeToCodec(decoded.code);

    const assetURL = `template-ipfs://{ipfscid:${version}:${codec}:reserve:sha2-256}`;

    const reserveAddress = algosdk.encodeAddress(
      Uint8Array.from(Buffer.from(decoded.multihash.digest))
    );

    return { assetURL, reserveAddress };
  }

  /**
   * Creates a new ARC-19 compliant NFT on the Algorand blockchain
   */
  static createNFT = async (
    path: string,
    filename: string,
    ipfs: IPFS,
    creator: { address: string; signer: TransactionSigner },
    name: string,
    unitName: string,
    properties: any,
    hasClawback: boolean,
    network: Network
  ) => {
    const image_cid = await ipfs.upload(path, filename);
    const mimeType = mime.lookup(filename) || 'application/octet-stream';
    let blob = new Blob([await fs.promises.readFile(path)], {
      type: mimeType,
    });
    const hash = await this.calculateSHA256(blob) //calculates hash of the blob
      .then(async (hash) => {
        return hash;
      })
      .catch((error) => {
        return { status: false, err: 'Error calculating SHA256 hash:' };
      });
    const metadataa = {
      name: name,
      unitName: unitName,
      creator: creator.address,
      image: 'ipfs://' + image_cid,
      image_integrity: `sha256-${hash}`,
      image_mimetype: mimeType,
      properties: properties,
    };
    const metadata_cid = await ipfs.uploadJson(metadataa, 'metadata.json');
    const { assetURL, reserveAddress } =
      this.createReserveAddressFromIpfsCid(metadata_cid);
    const algodClient = getAlgodClient(network);
    const suggestedParams = await algodClient.getTransactionParams().do();
    const nft_txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
      sender: creator.address,
      suggestedParams,
      defaultFrozen: false,
      unitName: unitName,
      assetName: name,
      manager: creator.address,
      reserve: reserveAddress,
      freeze: creator.address,
      clawback: hasClawback ? creator.address : undefined,
      assetURL: assetURL,
      total: 1,
      decimals: 0,
    });
    const signed = await creator.signer([nft_txn], [0]);
    const txid = await algodClient.sendRawTransaction(signed[0]).do();
    const result = await algosdk.waitForConfirmation(algodClient, txid.txid, 3);
    return {
      transactionId: txid.txid,
      assetId: Number(result.assetIndex || 0),
    };
  };

  static async createNFTwithImageCID(params: {
    path: string;
    filename: string;
    image_cid: string;
    ipfs: IPFS;
    creator: { address: string; signer: TransactionSigner };
    name: string;
    unitName: string;
    manager?: string;
    freeze?: string;
    clawback?: string;
    properties?: any;
    network: Network;
  }): Promise<{
    transactionId: string;
    assetId: number;
  }> {
    const {
      path,
      filename,
      image_cid,
      ipfs,
      creator,
      name,
      unitName,
      manager,
      freeze,
      clawback,
      properties,
      network,
    } = params;
    // Upload image to IPFS
    if (!image_cid) {
      throw new Error('Failed to upload image to IPFS');
    }

    // Determine the MIME type and calculate SHA256 hash of the image
    const mimeType = mime.lookup(filename) || 'application/octet-stream';
    const blob = new Blob([await fs.promises.readFile(path)], {
      type: mimeType,
    });
    const hash = await this.calculateSHA256(blob);

    // Construct metadata for the NFT
    const metadata = {
      name,
      unitName,
      creator: creator.address,
      image: `ipfs://${image_cid}`,
      image_integrity: `sha256-${hash}`,
      image_mimetype: mimeType,
      properties: properties || {},
    };

    // Upload metadata to IPFS
    const metadata_cid = await ipfs.uploadJson(metadata, 'metadata.json');
    if (!metadata_cid) {
      throw new Error('Failed to upload metadata to IPFS');
    }

    // Create the asset URL and reserve address from the IPFS CID
    const { assetURL, reserveAddress } =
      this.createReserveAddressFromIpfsCid(metadata_cid);

    // Fetch transaction parameters
    const algodClient = getAlgodClient(network);
    const suggestedParams = await algodClient.getTransactionParams().do();

    // Create the asset (NFT) transaction
    const nft_txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
      sender: creator.address,
      suggestedParams,
      defaultFrozen: false,
      unitName,
      assetName: name,
      manager: manager ? manager : undefined,
      reserve: reserveAddress,
      freeze: freeze ? freeze : undefined,
      clawback: clawback ? clawback : undefined,
      assetURL,
      total: 1,
      decimals: 0,
    });

    // Sign the transaction
    const signed = await creator.signer([nft_txn], [0]);

    // Send the transaction
    const txid = await algodClient.sendRawTransaction(signed[0]).do();

    // Wait for confirmation
    const result = await algosdk.waitForConfirmation(algodClient, txid.txid, 3);

    return {
      transactionId: txid.txid,
      assetId: Number(result.assetIndex || 0),
    };
  }

  static updateMetadataProperties = async (
    manager: { address: string; signer: TransactionSigner },
    updatedProperties: any,
    assetId: number,
    ipfs: IPFS,
    network: Network,
    ipfsHash?: string,
    filename?: string,
    path?: string
  ) => {
    try {
      let metadata_url = '';
      const indexerClient = getIndexerClient(network);
      var indexer_result = await indexerClient
        .lookupAssetByID(Number(assetId))
        .do();
      if (indexer_result.asset.params.url?.includes('template-ipfs://')) {
        metadata_url = this.resolveProtocol(
          indexer_result.asset.params.url,
          indexer_result.asset.params.reserve || ''
        );
        if (metadata_url.includes('template-ipfs://')) {
          return { status: false, err: 'Unable to resolve ipfs url' };
        }
      } else {
        return { status: false, err: 'Not a Mutable NFT' };
      }

      let mimeType;
      if (filename) {
        mimeType = mime.lookup(filename) || 'application/octet-stream';
      }
      let hash;
      if (path) {
        console.log('path:', path);
        const response = await axios.get(path, { responseType: 'arraybuffer' });
        const blob = new Blob([response.data], {
          type: mimeType,
        });
        hash = await this.calculateSHA256(blob);
      }

      const ipfs_gateway = 'https://ipfs.algonode.xyz/ipfs/';
      var metadata_res: any = await fetch(
        ipfs_gateway + metadata_url.split('://')[1]
      );
      var metadata = await metadata_res.json();
      metadata.image = ipfsHash ? `ipfs://${ipfsHash}` : metadata.image;
      metadata.image_integrity = path
        ? `sha256-${hash}`
        : metadata.image_integrity;
      metadata.image_mimetype = filename ? mimeType : metadata.image_mimetype;

      // adding owner
      metadata.properties = updatedProperties;

      const metadata_cid = await ipfs.uploadJson(metadata, 'metadata.json');
      const { assetURL, reserveAddress } =
        this.createReserveAddressFromIpfsCid(metadata_cid);
      const algodClient = getAlgodClient(network);
      const suggestedParams = await algodClient.getTransactionParams().do();
      const updatetxn = algosdk.makeAssetConfigTxnWithSuggestedParamsFromObject(
        {
          sender: manager.address,
          suggestedParams: suggestedParams,
          manager: manager.address,
          freeze: indexer_result.asset.params.freeze
            ? indexer_result.asset.params.freeze
            : metadata.creator,
          clawback: indexer_result.asset.params.clawback
            ? indexer_result.asset.params.clawback
            : metadata.creator,
          reserve: reserveAddress,
          assetIndex: Number(assetId),
          strictEmptyAddressChecking: false,
        }
      );
      const signed = await manager.signer([updatetxn], [0]);

      const txid = await algodClient.sendRawTransaction(signed[0]).do();
      const result = await algosdk.waitForConfirmation(
        algodClient,
        txid.txid,
        3
      );
      return {
        status: true,
        confirmedRound: result.confirmedRound,
        transactionId: txid.txid,
      };
    } catch (e) {
      return { status: false, err: e };
    }
  };

  static getMetadataVersions = async (assetId: number, network: Network) => {
    const ipfs_gateway = 'https://ipfs.algonode.xyz/ipfs/';
    const indexerClient = getIndexerClient(network);
    var assets_txns = await indexerClient
      .searchForTransactions()
      .assetID(assetId)
      .sigType('sig')
      .txType('acfg')
      .do();
    var url = '';
    const metadatas: Record<number, any>[] = [];
    for (var i = 0; i < assets_txns.transactions.length; i++) {
      if (i == 0) {
        url =
          (assets_txns.transactions[i] as any)['asset-config-transaction']
            ?.params?.url ||
          assets_txns.transactions[i].assetConfigTransaction?.params?.url ||
          '';
      }
      var round =
        (assets_txns.transactions[i] as any)['confirmed-round'] ||
        assets_txns.transactions[i].confirmedRound ||
        0;
      var metadata_url = this.resolveProtocol(
        url,
        (assets_txns.transactions[i] as any)['asset-config-transaction']?.params
          ?.reserve ||
          assets_txns.transactions[i].assetConfigTransaction?.params?.reserve ||
          ''
      );
      var metadata_res: any = await fetch(
        ipfs_gateway + metadata_url.split('://')[1]
      );
      var metadata = await metadata_res.json();
      var m: Record<number, any> = {};
      m[round] = metadata;
      metadatas.push(m);
    }
    while (true) {
      if (assets_txns.nextToken) {
        var assets_txns = await indexerClient
          .searchForTransactions()
          .assetID(assetId)
          .sigType('sig')
          .txType('acfg')
          .nextToken(assets_txns.nextToken)
          .do();
        for (var i = 0; i < assets_txns.transactions.length; i++) {
          if (i == 0) {
            url =
              (assets_txns.transactions[i] as any)['asset-config-transaction']
                ?.params?.url ||
              assets_txns.transactions[i].assetConfigTransaction?.params?.url ||
              '';
          }
          var round =
            (assets_txns.transactions[i] as any)['confirmed-round'] ||
            assets_txns.transactions[i].confirmedRound ||
            0;
          var metadata_url = this.resolveProtocol(
            url,
            (assets_txns.transactions[i] as any)['asset-config-transaction']
              ?.params?.reserve ||
              assets_txns.transactions[i].assetConfigTransaction?.params
                ?.reserve ||
              ''
          );
          var metadata_res: any = await fetch(
            ipfs_gateway + metadata_url.split('://')[1]
          );
          var metadata = await metadata_res.json();
          var m: Record<number, any> = {};
          m[round] = metadata;
          metadatas.push(m);
        }
      } else {
        break;
      }
    }
    return metadatas;
  };

  /**
   * Creates an Arc19 instance from an existing asset ID
   * @param id - The asset ID to load
   * @param network - The Algorand network to use
   * @returns A promise resolving to an Arc19 instance
   */
  static async fromId(id: number, network: Network): Promise<Arc19> {
    const asset = await CoreAsset.fromId(id, network);
    let metadata = {};

    try {
      const arc19Instance = new Arc19(id, asset.assetParams, {});
      if (arc19Instance.hasValidUrl()) {
        const metadataUrl = arc19Instance.getMetadataUrl();
        const response: AxiosResponse = await axios.get(metadataUrl);
        metadata = response.data;
      }
    } catch (e) {
      // Metadata fetch failed, use empty object
    }

    return new Arc19(id, asset.assetParams, metadata);
  }

  hasValidUrl(): boolean {
    const url = this.getUrl();

    if (!url) {
      return false;
    }

    const protocol = this.getUrlProtocol();
    if (protocol !== 'template-ipfs') {
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
    if (cidCodec !== 'raw' && cidCodec !== 'dag-pb') {
      return false;
    }
    if (asaField !== 'reserve') {
      return false;
    }

    return true;
  }

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
    const mhdigest = multiformats.digest.create(0x12, address.publicKey);
    const cid = multiformats.CID.create(
      parseInt(cidVersion) as Version,
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

  async getMetadata() {
    if (this.hasValidUrl()) {
      const url = this.getMetadataUrl();
      try {
        const response: AxiosResponse = await axios.get(url);
        return response.data;
      } catch (e) {
        return {};
      }
    }
    return this.metadata;
  }

  async validate(): Promise<{
    valid: boolean;
    error: string;
  }> {
    const validation = {
      valid: true,
      error: '',
    };

    if (!this.hasValidUrl()) {
      validation.valid = false;
      validation.error = `Url must be of form 
template-ipfs://{ipfscid:<version>:<multicodec>:<field name containing 32-byte digest, ie reserve>:<hash type>}[/...]`;
      return validation;
    }

    return validation;
  }
}
