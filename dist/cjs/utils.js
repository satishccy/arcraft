"use strict";
/**
 * Utility functions for working with Algorand clients
 * @module utils
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniversalBuffer = exports.calculateSHA256 = exports.uint8ArrayToBase64 = exports.base64ToUint8Array = exports.base64ToBuffer = exports.bufferToBase64 = exports.getIndexerClient = exports.getAlgodClient = void 0;
const algosdk_1 = require("algosdk");
const const_1 = require("./const");
// Ensure Buffer is available in browser environments
const buffer_1 = require("buffer");
// Make Buffer globally available for legacy code
if (typeof window !== 'undefined' && !window.Buffer) {
    window.Buffer = buffer_1.Buffer;
}
/**
 * Universal Buffer implementation that works in both Node.js and browser environments
 */
const UniversalBuffer = buffer_1.Buffer;
exports.UniversalBuffer = UniversalBuffer;
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
 * Converts a Buffer to a base64 encoded string
 * @param buffer - The Buffer to convert
 * @returns The base64 encoded string
 */
const bufferToBase64 = (buffer) => {
    return buffer.toString('base64');
};
exports.bufferToBase64 = bufferToBase64;
/**
 * Converts a base64 encoded string to a Buffer
 * @param base64 - The base64 encoded string to convert
 * @returns The resulting Buffer
 */
const base64ToBuffer = (base64) => {
    return UniversalBuffer.from(base64, 'base64');
};
exports.base64ToBuffer = base64ToBuffer;
/**
 * Converts a base64 encoded string to a Uint8Array
 * @param base64 - The base64 encoded string to convert
 * @returns The resulting Uint8Array
 */
const base64ToUint8Array = (base64) => {
    return Uint8Array.from(UniversalBuffer.from(base64, 'base64'));
};
exports.base64ToUint8Array = base64ToUint8Array;
/**
 * Converts a Uint8Array to a base64 encoded string
 * @param uint8Array - The Uint8Array to convert
 * @returns The base64 encoded string
 */
const uint8ArrayToBase64 = (uint8Array) => {
    return UniversalBuffer.from(uint8Array).toString('base64');
};
exports.uint8ArrayToBase64 = uint8ArrayToBase64;
/**
 * Universal SHA256 hash function that works in both Node.js and browser environments
 * @param data - The data to hash (Buffer, Uint8Array, or ArrayBuffer)
 * @returns Promise resolving to hex-encoded hash string
 */
const calculateSHA256 = async (data) => {
    // Node.js environment
    if (typeof window === 'undefined' && typeof require === 'function') {
        try {
            const crypto = require('crypto');
            const hash = crypto.createHash('sha256');
            const buffer = buffer_1.Buffer.isBuffer(data)
                ? data
                : data instanceof Uint8Array
                    ? buffer_1.Buffer.from(data)
                    : buffer_1.Buffer.from(new Uint8Array(data));
            hash.update(buffer);
            return hash.digest('hex');
        }
        catch (error) {
            // Fall through to Web Crypto API
        }
    }
    // Browser environment - use Web Crypto API
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
        let arrayBuffer;
        if (data instanceof ArrayBuffer) {
            arrayBuffer = data;
        }
        else if (ArrayBuffer.isView(data)) {
            arrayBuffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
        }
        else {
            arrayBuffer = new Uint8Array(data).buffer;
        }
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', arrayBuffer);
        const hashArray = new Uint8Array(hashBuffer);
        const hashHex = Array.from(hashArray)
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('');
        return hashHex;
    }
    // Fallback error
    throw new Error('No crypto implementation available');
};
exports.calculateSHA256 = calculateSHA256;
//# sourceMappingURL=utils.js.map