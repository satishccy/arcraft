"use strict";
/**
 * Utility functions for working with Algorand clients
 * @module utils
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.uint8ArrayToBase64Url = exports.base64UrlToUint8Array = exports.base64UrlToBuffer = exports.bufferToBase64Url = exports.getIndexerClient = exports.getAlgodClient = void 0;
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
/**
 * Converts a Buffer to a base64url encoded string
 * @param buffer - The Buffer to convert
 * @returns The base64url encoded string
 */
const bufferToBase64Url = (buffer) => {
    return buffer
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
};
exports.bufferToBase64Url = bufferToBase64Url;
/**
 * Converts a base64url encoded string to a Buffer
 * @param base64Url - The base64url encoded string to convert
 * @returns The resulting Buffer
 */
const base64UrlToBuffer = (base64Url) => {
    return Buffer.from(base64Url, 'base64');
};
exports.base64UrlToBuffer = base64UrlToBuffer;
/**
 * Converts a base64url encoded string to a Uint8Array
 * @param base64Url - The base64url encoded string to convert
 * @returns The resulting Uint8Array
 */
const base64UrlToUint8Array = (base64Url) => {
    return Uint8Array.from(Buffer.from(base64Url, 'base64'));
};
exports.base64UrlToUint8Array = base64UrlToUint8Array;
/**
 * Converts a Uint8Array to a base64url encoded string
 * @param uint8Array - The Uint8Array to convert
 * @returns The base64url encoded string
 */
const uint8ArrayToBase64Url = (uint8Array) => {
    return Buffer.from(uint8Array)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
};
exports.uint8ArrayToBase64Url = uint8ArrayToBase64Url;
//# sourceMappingURL=utils.js.map