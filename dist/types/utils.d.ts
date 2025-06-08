/**
 * Utility functions for working with Algorand clients
 * @module utils
 */
import { Algodv2, Indexer } from 'algosdk';
import { Network } from './types';
/**
 * Gets an Algorand client instance for the specified network
 * @param network - The network to connect to
 * @returns An Algodv2 client instance
 */
declare const getAlgodClient: (network: Network) => Algodv2;
/**
 * Gets an Indexer client instance for the specified network
 * @param network - The network to connect to
 * @returns An Indexer client instance
 */
declare const getIndexerClient: (network: Network) => Indexer;
/**
 * Converts a Buffer to a base64url encoded string
 * @param buffer - The Buffer to convert
 * @returns The base64url encoded string
 */
declare const bufferToBase64Url: (buffer: Buffer) => string;
/**
 * Converts a base64url encoded string to a Buffer
 * @param base64Url - The base64url encoded string to convert
 * @returns The resulting Buffer
 */
declare const base64UrlToBuffer: (base64Url: string) => Buffer<ArrayBuffer>;
/**
 * Converts a base64url encoded string to a Uint8Array
 * @param base64Url - The base64url encoded string to convert
 * @returns The resulting Uint8Array
 */
declare const base64UrlToUint8Array: (base64Url: string) => Uint8Array<ArrayBuffer>;
/**
 * Converts a Uint8Array to a base64url encoded string
 * @param uint8Array - The Uint8Array to convert
 * @returns The base64url encoded string
 */
declare const uint8ArrayToBase64Url: (uint8Array: Uint8Array) => string;
export { getAlgodClient, getIndexerClient, bufferToBase64Url, base64UrlToBuffer, base64UrlToUint8Array, uint8ArrayToBase64Url, };
