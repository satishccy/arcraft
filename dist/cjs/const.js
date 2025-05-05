"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IPFS_GATEWAY = exports.networks = void 0;
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
const IPFS_GATEWAY = 'https://ipfs.io/ipfs/';
exports.IPFS_GATEWAY = IPFS_GATEWAY;
//# sourceMappingURL=const.js.map