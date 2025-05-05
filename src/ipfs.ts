/**
 * IPFS integration module for handling file uploads to IPFS through various providers.
 * @module ipfs
 */

import { uploadJsonToPinata, uploadToPinata } from './pinata';

/** Supported IPFS providers */
export type providers = 'pinata';

/** Configuration for Pinata IPFS provider */
export type PinataConfig = {
  /** Provider identifier, must be 'pinata' */
  provider: 'pinata';
  /** JWT token for Pinata authentication */
  jwt: string;
};

/**
 * Class for handling IPFS file uploads through various providers
 */
export class IPFS {
  private provider: providers;
  private config: PinataConfig;

  /**
   * Creates an instance of the IPFS class
   * @param provider - The IPFS provider to use
   * @param config - Configuration for the selected provider
   */
  constructor(provider: providers, config: PinataConfig) {
    this.provider = provider;
    this.config = config;
  }

  /**
   * Uploads a file to IPFS
   * @param file - Path to the file to upload
   * @param fileName - Name to use for the file
   * @returns Promise resolving to the IPFS content identifier (CID)
   */
  async upload(file: string, fileName: string): Promise<string> {
    if (this.provider === 'pinata' && this.config.jwt) {
      const result = await uploadToPinata({
        file,
        name: fileName,
        token: this.config.jwt,
      });
      return result.IpfsHash;
    } else {
      throw new Error('Provider not supported');
    }
  }

  /**
   * Uploads a JSON object to IPFS
   * @param json - The JSON object to upload
   * @param fileName - Name to use for the file
   * @returns Promise resolving to the IPFS content identifier (CID)
   */
  async uploadJson(json: object, fileName: string): Promise<string> {
    if (this.provider === 'pinata' && this.config.jwt) {
      const result = await uploadJsonToPinata({
        json,
        name: fileName,
        token: this.config.jwt,
      });
      return result.IpfsHash;
    } else {
      throw new Error('Provider not supported');
    }
  }
}
