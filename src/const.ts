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
const networks: Record<Network, NetworkConfig> = {
  mainnet: {
    name: 'mainnet',
    algod: {
      server: 'https://mainnet-api.algonode.cloud',
      port: 443,
      token: 'a'.repeat(64),
    },
    indexer: {
      server: 'https://mainnet-idx.algonode.cloud',
      port: 443,
      token: 'a'.repeat(64),
    },
  },
  testnet: {
    name: 'testnet',
    algod: {
      server: 'https://testnet-api.algonode.cloud',
      port: 443,
      token: 'a'.repeat(64),
    },
    indexer: {
      server: 'https://testnet-idx.algonode.cloud',
      port: 443,
      token: 'a'.repeat(64),
    },
  },
  localnet: {
    name: 'localnet',
    algod: {
      server: 'http://localhost',
      port: 4001,
      token: 'a'.repeat(64),
    },
    indexer: {
      server: 'http://localhost',
      port: 8980,
      token: 'a'.repeat(64),
    },
  },
};

/**
 * Default IPFS gateway URL used for resolving IPFS content
 */
const IPFS_GATEWAY = 'https://ipfs.io/ipfs/';

/**
 * Read account address which is funded on all networks (except localnet) for simulation
 */
const READ_ACCOUNT =
  'A7NMWS3NT3IUDMLVO26ULGXGIIOUQ3ND2TXSER6EBGRZNOBOUIQXHIBGDE';

/**
 * Simulate request for simulation of transactions
 */
const simulateRequest = new algosdk.modelsv2.SimulateRequest({
  allowEmptySignatures: true,
  allowMoreLogging: true,
  allowUnnamedResources: true,
  fixSigners: true,
  extraOpcodeBudget: 320000,
  txnGroups: [],
});

export { networks, IPFS_GATEWAY, READ_ACCOUNT, simulateRequest };
