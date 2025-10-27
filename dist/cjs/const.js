"use strict";
/**
 * Constants used throughout the library
 * @module const
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.simulateRequest = exports.READ_ACCOUNT = exports.IPFS_GATEWAY = exports.networks = void 0;
const algosdk_1 = __importDefault(require("algosdk"));
/**
 * Network configurations for different Algorand networks
 * Each configuration includes connection details for Algod and Indexer services
 */
const networks = {
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
exports.networks = networks;
/**
 * Default IPFS gateway URL used for resolving IPFS content
 */
const IPFS_GATEWAY = 'https://ipfs.io/ipfs/';
exports.IPFS_GATEWAY = IPFS_GATEWAY;
/**
 * Read account address which is funded on all networks (except localnet) for simulation
 */
const READ_ACCOUNT = 'A7NMWS3NT3IUDMLVO26ULGXGIIOUQ3ND2TXSER6EBGRZNOBOUIQXHIBGDE';
exports.READ_ACCOUNT = READ_ACCOUNT;
/**
 * Simulate request for simulation of transactions
 */
const simulateRequest = new algosdk_1.default.modelsv2.SimulateRequest({
    allowEmptySignatures: true,
    allowMoreLogging: true,
    allowUnnamedResources: true,
    fixSigners: true,
    extraOpcodeBudget: 320000,
    txnGroups: [],
});
exports.simulateRequest = simulateRequest;
//# sourceMappingURL=const.js.map