"use strict";
/**
 * Utility functions for working with Algorand clients
 * @module utils
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIndexerClient = exports.getAlgodClient = void 0;
const algosdk_1 = require("algosdk");
const const_1 = require("./const");
/**
 * Gets an Algorand client instance for the specified network
 * @param network - The network to connect to
 * @returns An Algodv2 client instance
 */
const getAlgodClient = (network) => {
    const config = const_1.networks[network];
    return new algosdk_1.Algodv2(config.algod.token, config.algod.server, config.algod.port);
};
exports.getAlgodClient = getAlgodClient;
/**
 * Gets an Indexer client instance for the specified network
 * @param network - The network to connect to
 * @returns An Indexer client instance
 */
const getIndexerClient = (network) => {
    const config = const_1.networks[network];
    return new algosdk_1.Indexer(config.indexer.token, config.indexer.server, config.indexer.port);
};
exports.getIndexerClient = getIndexerClient;
//# sourceMappingURL=utils.js.map