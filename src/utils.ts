/**
 * Utility functions for working with Algorand clients
 * @module utils
 */

import { Algodv2, Indexer } from 'algosdk';
import { Network } from './types';
import { networks } from './const';
// Ensure Buffer is available in browser environments
import { Buffer } from 'buffer';

// Make Buffer globally available for legacy code
if (typeof window !== 'undefined' && !window.Buffer) {
  (window as any).Buffer = Buffer;
}

/**
 * Universal Buffer implementation that works in both Node.js and browser environments
 */
const UniversalBuffer = Buffer;

/**
 * Gets an Algorand client instance for the specified network
 * @param network - The network to connect to
 * @returns An Algodv2 client instance
 */
const getAlgodClient = (network: Network) => {
  const config = networks[network];
  return new Algodv2(
    config.algod.token,
    config.algod.server,
    config.algod.port
  );
};

/**
 * Gets an Indexer client instance for the specified network
 * @param network - The network to connect to
 * @returns An Indexer client instance
 */
const getIndexerClient = (network: Network) => {
  const config = networks[network];
  return new Indexer(
    config.indexer.token,
    config.indexer.server,
    config.indexer.port
  );
};

/**
 * Converts a Buffer to a base64 encoded string
 * @param buffer - The Buffer to convert
 * @returns The base64 encoded string
 */
const bufferToBase64 = (buffer: Buffer) => {
  return buffer.toString('base64');
};

/**
 * Converts a base64 encoded string to a Buffer
 * @param base64 - The base64 encoded string to convert
 * @returns The resulting Buffer
 */
const base64ToBuffer = (base64: string) => {
  return UniversalBuffer.from(base64, 'base64');
};

/**
 * Converts a base64 encoded string to a Uint8Array
 * @param base64 - The base64 encoded string to convert
 * @returns The resulting Uint8Array
 */
const base64ToUint8Array = (base64: string) => {
  return Uint8Array.from(UniversalBuffer.from(base64, 'base64'));
};

/**
 * Converts a Uint8Array to a base64 encoded string
 * @param uint8Array - The Uint8Array to convert
 * @returns The base64 encoded string
 */
const uint8ArrayToBase64 = (uint8Array: Uint8Array) => {
  return UniversalBuffer.from(uint8Array).toString('base64');
};

/**
 * Universal SHA256 hash function that works in both Node.js and browser environments
 * @param data - The data to hash (Buffer, Uint8Array, or ArrayBuffer)
 * @returns Promise resolving to hex-encoded hash string
 */
const calculateSHA256 = async (
  data: Buffer | Uint8Array | ArrayBuffer
): Promise<string> => {
  // Node.js environment
  if (typeof window === 'undefined' && typeof require === 'function') {
    try {
      const crypto = require('crypto');
      const hash = crypto.createHash('sha256');
      hash.update(UniversalBuffer.from(data));
      return hash.digest('hex');
    } catch (error) {
      // Fall through to Web Crypto API
    }
  }

  // Browser environment - use Web Crypto API
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = new Uint8Array(hashBuffer);
    const hashHex = Array.from(hashArray)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    return hashHex;
  }

  // Fallback error
  throw new Error('No crypto implementation available');
};

export {
  getAlgodClient,
  getIndexerClient,
  bufferToBase64,
  base64ToBuffer,
  base64ToUint8Array,
  uint8ArrayToBase64,
  calculateSHA256,
  UniversalBuffer,
};
