/**
 * Utility functions for working with Algorand clients
 * @module utils
 */
import algosdk from 'algosdk';
import { Network } from './types';
import { Buffer } from 'buffer';
/**
 * Universal Buffer implementation that works in both Node.js and browser environments
 */
declare const UniversalBuffer: BufferConstructor;
/**
 * Gets an Algorand client instance for the specified network
 * @param network - The network to connect to
 * @returns An Algodv2 client instance
 */
declare const getAlgodClient: (network: Network) => algosdk.Algodv2;
/**
 * Gets an Indexer client instance for the specified network
 * @param network - The network to connect to
 * @returns An Indexer client instance
 */
declare const getIndexerClient: (network: Network) => algosdk.Indexer;
/**
 * Converts a Buffer to a base64 encoded string
 * @param buffer - The Buffer to convert
 * @returns The base64 encoded string
 */
declare const bufferToBase64: (buffer: Buffer) => string;
/**
 * Converts a base64 encoded string to a Buffer
 * @param base64 - The base64 encoded string to convert
 * @returns The resulting Buffer
 */
declare const base64ToBuffer: (base64: string) => Buffer<ArrayBuffer>;
/**
 * Converts a base64 encoded string to a Uint8Array
 * @param base64 - The base64 encoded string to convert
 * @returns The resulting Uint8Array
 */
declare const base64ToUint8Array: (base64: string) => Uint8Array<ArrayBuffer>;
/**
 * Converts a Uint8Array to a base64 encoded string
 * @param uint8Array - The Uint8Array to convert
 * @returns The base64 encoded string
 */
declare const uint8ArrayToBase64: (uint8Array: Uint8Array) => string;
/**
 * Universal SHA256 hash function that works in both Node.js and browser environments
 * @param data - The data to hash (Buffer, Uint8Array, or ArrayBuffer)
 * @returns Promise resolving to hex-encoded hash string
 */
declare const calculateSHA256: (data: Buffer | Uint8Array | ArrayBuffer) => Promise<string>;
export { getAlgodClient, getIndexerClient, bufferToBase64, base64ToBuffer, base64ToUint8Array, uint8ArrayToBase64, calculateSHA256, UniversalBuffer, };
