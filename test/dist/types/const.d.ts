/**
 * Constants used throughout the library
 * @module const
 */
import { Network, NetworkConfig } from './types';
/**
 * Network configurations for different Algorand networks
 * Each configuration includes connection details for Algod and Indexer services
 */
declare const networks: Record<Network, NetworkConfig>;
/**
 * Default IPFS gateway URL used for resolving IPFS content
 */
declare const IPFS_GATEWAY = "https://ipfs.io/ipfs/";
export { networks, IPFS_GATEWAY };
