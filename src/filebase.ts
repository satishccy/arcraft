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
    console.error(`Error uploading file to Filebase: ${error}`);
    throw error;
  }
}

/**
 * Uploads a file to Filebase IPFS service (Browser version)
 * Uses direct HTTP API to avoid stream compatibility issues
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
    // Try the FilebaseClient first, with fallback to direct HTTP API
    try {
      const client = new FilebaseClient({ token });
      const fileName = name || file.name;
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
    } catch (clientError) {
      // Fallback to direct HTTP API upload
      return await uploadToFilebaseDirectAPI(file, token, name);
    }
  } catch (error) {
    console.error(`Error uploading file to Filebase: ${error}`);
    throw error;
  }
}

/**
 * Direct HTTP API upload to Filebase (fallback for browser compatibility)
 * @param file - The File object to upload
 * @param name - Optional name for the file
 * @param token - Filebase API token
 * @returns Promise resolving to FilebaseResponse
 * @throws Error if HTTP upload fails
 * @private
 */
async function uploadToFilebaseDirectAPI(
  file: File,
  token: string,
  name?: string
): Promise<FilebaseResponse> {
  try {
    // Create FormData for multipart upload
    const formData = new FormData();
    formData.append('file', file);

    // Upload using fetch API
    const response = await fetch('https://rpc.filebase.io', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    const fileName = name || file.name;

    return {
      cid: result.Hash || result.cid,
      name: fileName,
      size: file.size,
      metadata: {
        uploadedAt: new Date().toISOString(),
        environment: 'browser-direct-api',
        type: file.type,
        httpStatus: response.status,
      },
    };
  } catch (error) {
    console.error(`Error uploading JSON to Filebase: ${error}`);
    throw error;
  }
}

async function uploadJsonToFilebaseDirectAPI(
  json: object,
  token: string,
  name?: string
): Promise<FilebaseResponse> {
  const jsonString = JSON.stringify(json);
  const jsonBlob = new Blob([jsonString], {
    type: 'application/json',
  });

  return await uploadToFilebaseDirectAPI(jsonBlob as File, token, name);
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
    return await uploadToFilebaseNode(options);
  } else {
    return await uploadToFilebaseBrowser(options);
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
  name?: string;
  /**
   * Filebase API token for authentication
   */
  token: string;
}

/**
 * Uploads a JSON object to Filebase IPFS service
 * Converts the JSON to a string and uploads as a file
 * @param options - Upload configuration options
 * @returns Promise resolving to the Filebase API response with IPFS hash
 * @throws Error if upload fails or JSON serialization fails
 */
async function uploadJsonToFilebase({
  json,
  name,
  token,
}: FilebaseJsonUploadOptions): Promise<FilebaseResponse> {
  try {
    const client = new FilebaseClient({ token });

    // Convert JSON to string and create blob
    const jsonString = JSON.stringify(json);
    const jsonBlob = new Blob([jsonString], {
      type: 'application/json',
    });

    // Upload to Filebase
    const result = await client.storeBlob(jsonBlob);

    return {
      cid: result,
      name: name
        ? name.endsWith('.json')
          ? name
          : `${name}.json`
        : 'metadata.json',
      size: jsonBlob.size,
      metadata: {
        uploadedAt: new Date().toISOString(),
        contentType: 'application/json',
        originalJson: Object.keys(json).length,
      },
    };
  } catch (error) {
    console.error(`Error uploading JSON to Filebase: ${error}`);
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
