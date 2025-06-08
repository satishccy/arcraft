/**
 * Filebase IPFS service integration module that provides utilities for uploading files and JSON to Filebase.
 * Supports both Node.js and browser environments.
 * @module filebase
 */
import { FilebaseClient } from '@filebase/client';

// Environment detection
const isNode =
  typeof window === 'undefined' &&
  typeof process !== 'undefined' &&
  process.versions?.node;

// Dynamic imports for Node.js-specific modules
let fs: any;
if (isNode) {
  try {
    fs = require('fs');
  } catch (error) {
    // Modules not available, will use browser APIs
  }
}

/**
 * Configuration options for uploading files to Filebase (Node.js)
 */
export interface FilebaseUploadOptionsNode {
  /**
   * The file path to upload
   */
  file: string;
  /**
   * Name for the file in Filebase
   */
  name?: string;
  /**
   * Filebase API token for authentication
   */
  token: string;
}

/**
 * Configuration options for uploading files to Filebase (Browser)
 */
export interface FilebaseUploadOptionsBrowser {
  /**
   * The File object to upload (from HTML input or drag-drop)
   */
  file: File;
  /**
   * Name for the file in Filebase (optional, will use file.name if not provided)
   */
  name?: string;
  /**
   * Filebase API token for authentication
   */
  token: string;
}

/**
 * Configuration options for uploading files to Filebase (Universal)
 */
export type FilebaseUploadOptions =
  | FilebaseUploadOptionsNode
  | FilebaseUploadOptionsBrowser;

/**
 * Response object returned by Filebase API after a successful upload
 */
export interface FilebaseResponse {
  /**
   * IPFS content identifier (CID) of the uploaded file
   */
  cid: string;
  /**
   * Name of the uploaded file
   */
  name: string;
  /**
   * Size of the uploaded content in bytes
   */
  size: number;
  /**
   * Additional metadata about the upload
   */
  metadata?: Record<string, any>;
}

/**
 * Type guard to check if options are for Node.js environment
 * @param options - The upload options to check
 * @returns True if options are for Node.js environment
 */
function isNodeOptions(
  options: FilebaseUploadOptions
): options is FilebaseUploadOptionsNode {
  return typeof (options as FilebaseUploadOptionsNode).file === 'string';
}

/**
 * Uploads a file to Filebase IPFS service (Node.js version)
 * @param options - Upload configuration options
 * @returns Promise resolving to the Filebase API response with IPFS hash
 * @throws Error if upload fails or Node.js modules are not available
 */
async function uploadToFilebaseNode({
  file,
  name,
  token,
}: FilebaseUploadOptionsNode): Promise<FilebaseResponse> {
  if (!fs) {
    throw new Error('Node.js file system modules not available');
  }

  try {
    const client = new FilebaseClient({ token });

    // Read file content
    const fileContent = fs.readFileSync(file);
    const fileName = name || file.split('/').pop() || 'unnamed';

    // Create File-like object for Node.js
    const fileObject = new Blob([fileContent], {
      type: 'application/octet-stream',
    });

    // Upload to Filebase
    const result = await client.storeBlob(fileObject);

    return {
      cid: result,
      name: fileName,
      size: fileContent.length,
      metadata: {
        uploadedAt: new Date().toISOString(),
        environment: 'node',
      },
    };
  } catch (error) {
    console.log(':ERROR', error);
    throw error;
  }
}

/**
 * Uploads a file to Filebase IPFS service (Browser version)
 * @param options - Upload configuration options
 * @returns Promise resolving to the Filebase API response with IPFS hash
 * @throws Error if upload fails
 */
async function uploadToFilebaseBrowser({
  file,
  name,
  token,
}: FilebaseUploadOptionsBrowser): Promise<FilebaseResponse> {
  try {
    const client = new FilebaseClient({ token });

    const fileName = name || file.name;

    // Upload to Filebase
    const result = await client.storeBlob(file);

    return {
      cid: result,
      name: fileName,
      size: file.size,
      metadata: {
        uploadedAt: new Date().toISOString(),
        environment: 'browser',
        type: file.type,
      },
    };
  } catch (error) {
    console.log(':ERROR', error);
    throw error;
  }
}

/**
 * Uploads a file to Filebase IPFS service (Universal function)
 * Automatically detects environment and uses appropriate upload method
 * @param options - Upload configuration options
 * @returns Promise resolving to the Filebase API response with IPFS hash
 * @throws Error if upload fails
 */
async function uploadToFilebase(
  options: FilebaseUploadOptions
): Promise<FilebaseResponse> {
  if (isNodeOptions(options)) {
    // Node.js environment - file is a string path
    return uploadToFilebaseNode(options);
  } else {
    // Browser environment - file is a File object
    return uploadToFilebaseBrowser(options);
  }
}

/**
 * Configuration options for uploading JSON objects to Filebase
 */
export interface FilebaseJsonUploadOptions {
  /**
   * The JSON object to upload
   */
  json: object;
  /**
   * Name for the JSON file in Filebase
   */
  name: string;
  /**
   * Filebase API token for authentication
   */
  token: string;
}

/**
 * Uploads a JSON object to Filebase IPFS service
 * @param options - JSON upload configuration options
 * @returns Promise resolving to the Filebase API response with IPFS hash
 * @throws Error if upload fails
 */
async function uploadJsonToFilebase({
  json,
  name,
  token,
}: FilebaseJsonUploadOptions): Promise<FilebaseResponse> {
  try {
    const client = new FilebaseClient({ token });

    // Convert JSON to blob
    const jsonString = JSON.stringify(json);
    const jsonBlob = new Blob([jsonString], { type: 'application/json' });

    // Upload to Filebase
    const result = await client.storeBlob(jsonBlob);

    return {
      cid: result,
      name: name.endsWith('.json') ? name : `${name}.json`,
      size: jsonBlob.size,
      metadata: {
        uploadedAt: new Date().toISOString(),
        type: 'application/json',
        contentType: 'json',
      },
    };
  } catch (error) {
    console.log(':ERROR', error);
    throw error;
  }
}

// Example usage:
//
// Node.js:
// import path from 'path';
// import { uploadToFilebase, uploadJsonToFilebase } from 'arcraft';
//
// const result = await uploadToFilebase({
//   file: path.resolve('./assets/example.jpg'),
//   name: 'example.jpg',
//   token: process.env.FILEBASE_API_TOKEN || '',
// });
//
// Browser:
// import { uploadToFilebase } from 'arcraft';
//
// const fileInput = document.getElementById('fileInput') as HTMLInputElement;
// const file = fileInput.files[0];
// const result = await uploadToFilebase({
//   file: file,
//   name: 'example.jpg',
//   token: 'YOUR_FILEBASE_API_TOKEN',
// });

export { uploadToFilebase, uploadJsonToFilebase };
