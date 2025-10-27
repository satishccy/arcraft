/**
 * Constants used throughout the library
 * @module const
 */
import { Network, NetworkConfig } from './types';
import algosdk from 'algosdk';
/**
 * Network configurations for different Algorand networks
 * Each configuration includes connection details for Algod and Indexer services
 */
declare const networks: Record<Network, NetworkConfig>;
/**
 * Default IPFS gateway URL used for resolving IPFS content
 */
declare const IPFS_GATEWAY = "https://ipfs.io/ipfs/";
/**
 * Read account address which is funded on all networks (except localnet) for simulation
 */
declare const READ_ACCOUNT = "A7NMWS3NT3IUDMLVO26ULGXGIIOUQ3ND2TXSER6EBGRZNOBOUIQXHIBGDE";
/**
 * Simulate request for simulation of transactions
 */
declare const simulateRequest: algosdk.modelsv2.SimulateRequest;
export { networks, IPFS_GATEWAY, READ_ACCOUNT, simulateRequest };
