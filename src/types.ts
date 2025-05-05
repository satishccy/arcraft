/**
 * Common type definitions used throughout the library
 * @module types
 */

import algosdk, { TransactionSigner } from 'algosdk';

/**
 * Supported Algorand networks
 */
type Network = 'mainnet' | 'testnet' | 'localnet';

/**
 * Configuration for connecting to Algorand networks
 */
type NetworkConfig = {
  /** Network name */
  name: Network;
  /** Algod (node) configuration */
  algod: {
    /** Server URL */
    server: string;
    /** Server port */
    port: number;
    /** API token */
    token: string;
  };
  /** Indexer configuration */
  indexer: {
    /** Server URL */
    server: string;
    /** Server port */
    port: number;
    /** API token */
    token: string;
  };
};

export { Network, NetworkConfig };
