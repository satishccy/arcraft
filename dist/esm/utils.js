/**
 * Utility functions for working with Algorand clients
 * @module utils
 */
import { Algodv2, Indexer } from 'algosdk';
import { networks } from './const';
/**
 * Gets an Algorand client instance for the specified network
 * @param network - The network to connect to
 * @returns An Algodv2 client instance
 */
const getAlgodClient = (network) => {
    const config = networks[network];
    return new Algodv2(config.algod.token, config.algod.server, config.algod.port);
};
/**
 * Gets an Indexer client instance for the specified network
 * @param network - The network to connect to
 * @returns An Indexer client instance
 */
const getIndexerClient = (network) => {
    const config = networks[network];
    return new Indexer(config.indexer.token, config.indexer.server, config.indexer.port);
};
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
/**
 * Converts a base64url encoded string to a Buffer
 * @param base64Url - The base64url encoded string to convert
 * @returns The resulting Buffer
 */
const base64UrlToBuffer = (base64Url) => {
    return Buffer.from(base64Url, 'base64');
};
/**
 * Converts a base64url encoded string to a Uint8Array
 * @param base64Url - The base64url encoded string to convert
 * @returns The resulting Uint8Array
 */
const base64UrlToUint8Array = (base64Url) => {
    return Uint8Array.from(Buffer.from(base64Url, 'base64'));
};
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
export { getAlgodClient, getIndexerClient, bufferToBase64Url, base64UrlToBuffer, base64UrlToUint8Array, uint8ArrayToBase64Url, };
//# sourceMappingURL=utils.js.map