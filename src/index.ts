/**
 * @module arcraft
 *
 * Main entry point for the Arcraft SDK, providing utilities for working with Algorand ARC standards.
 * This package is designed for Node.js backends and provides tools for NFT creation,
 * IPFS integration, and more.
 */

// Export base classes and utilities first (no dependencies)
export * from './types';
export * from './utils';
export * from './const';
export * from './ipfs';
export * from './pinata';
export * from './filebase';
export * from './mimeUtils';

// Export CoreAsset (base class, no dependencies on ARC classes)
export { CoreAsset } from './coreAsset';

// Export ARC classes (depend on CoreAsset but not each other)
export { Arc3 } from './arc3';
export { Arc19 } from './arc19';
export { Arc69 } from './arc69';
export { Arc59 } from './arc59';
export { Arc54 } from './arc54';

// Export AssetFactory (depends on all ARC classes)
export { AssetFactory } from './assetFactory';

// Export ARC-82 (standalone)
export { Arc82, Arc82Utils, Arc82ParseError, Arc82QueryError } from './arc82';
