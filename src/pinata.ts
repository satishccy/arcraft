/**
 * Pinata IPFS service integration module that provides utilities for uploading files and JSON to Pinata.
 * Supports both Node.js and browser environments.
 * @module pinata
 */
import axios from 'axios';

// Environment detection
const isNode =
  typeof window === 'undefined' &&
  typeof process !== 'undefined' &&
  process.versions?.node;

// Dynamic imports for Node.js-specific modules
let fs: any;
let FormDataNode: any;

if (isNode) {
  try {
    fs = require('fs');
    FormDataNode = require('form-data');
  } catch (error) {
    // Modules not available, will use browser APIs
  }
}

/**
 * Configuration options for uploading files to Pinata (Node.js)
 */
export interface PinataUploadOptionsNode {
  /**
   * The file path to upload
   */
  file: string;
  /**
   * Name for the file in Pinata
   */
  name?: string;
  /**
   * Pinata API JWT token for authentication
   */
  token: string;
}

/**
 * Configuration options for uploading files to Pinata (Browser)
 */
export interface PinataUploadOptionsBrowser {
  /**
   * The File object to upload (from HTML input or drag-drop)
   */
  file: File;
  /**
   * Name for the file in Pinata (optional, will use file.name if not provided)
   */
  name?: string;
  /**
   * Pinata API JWT token for authentication
   */
  token: string;
}

/**
 * Configuration options for uploading files to Pinata (Universal)
 */
export type PinataUploadOptions =
  | PinataUploadOptionsNode
  | PinataUploadOptionsBrowser;

/**
 * Response object returned by Pinata API after a successful upload
 */
export interface PinataResponse {
  /**
   * IPFS content identifier (CID) of the uploaded file
   */
  IpfsHash: string;
  /**
   * Size of the pinned content in bytes
   */
  PinSize: number;
  /**
   * Timestamp of when the file was pinned
   */
  Timestamp: string;
  /**
   * Indicates if the file was already pinned previously
   */
  isDuplicate?: boolean;
}

/**
 * Type guard to check if options are for Node.js environment
 */
function isNodeOptions(
  options: PinataUploadOptions
): options is PinataUploadOptionsNode {
  return typeof (options as PinataUploadOptionsNode).file === 'string';
}

/**
 * Uploads a file to Pinata IPFS service (Node.js version)
 * @param options - Upload configuration options
 * @returns Promise resolving to the Pinata API response with IPFS hash
 * @throws Error if upload fails
 */
async function uploadToPinataNode({
  file,
  name,
  token,
}: PinataUploadOptionsNode): Promise<PinataResponse> {
  if (!fs || !FormDataNode) {
    throw new Error('Node.js file system modules not available');
  }

  try {
    const formData = new FormDataNode();
    const fileStream = fs.createReadStream(file);
    formData.append('file', fileStream);
    const fileName = name || file.split('/').pop();

    const pinataMetadata = JSON.stringify({
      name: fileName,
    });
    formData.append('pinataMetadata', pinataMetadata);

    const pinataOptions = JSON.stringify({
      cidVersion: 0,
    });
    formData.append('pinataOptions', pinataOptions);

    const res = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        headers: {
          'Content-Type': `multipart/form-data`,
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data as PinataResponse;
  } catch (error) {
    console.error(`Error uploading file to Pinata: ${error}`);
    throw error;
  }
}

/**
 * Uploads a file to Pinata IPFS service (Browser version)
 * @param options - Upload configuration options
 * @returns Promise resolving to the Pinata API response with IPFS hash
 * @throws Error if upload fails
 */
async function uploadToPinataBrowser({
  file,
  name,
  token,
}: PinataUploadOptionsBrowser): Promise<PinataResponse> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const pinataMetadata = JSON.stringify({
      name: name || file.name,
    });
    formData.append('pinataMetadata', pinataMetadata);

    const pinataOptions = JSON.stringify({
      cidVersion: 0,
    });
    formData.append('pinataOptions', pinataOptions);

    const res = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        headers: {
          'Content-Type': `multipart/form-data`,
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data as PinataResponse;
  } catch (error) {
    console.error(`Error uploading file to Pinata: ${error}`);
    throw error;
  }
}

/**
 * Uploads a file to Pinata IPFS service (Universal function)
 * @param options - Upload configuration options
 * @returns Promise resolving to the Pinata API response with IPFS hash
 * @throws Error if upload fails
 */
async function uploadToPinata(
  options: PinataUploadOptions
): Promise<PinataResponse> {
  if (isNodeOptions(options)) {
    // Node.js environment - file is a string path
    return uploadToPinataNode(options);
  } else {
    // Browser environment - file is a File object
    return uploadToPinataBrowser(options);
  }
}

/**
 * Configuration options for uploading JSON objects to Pinata
 */
export interface PinataJsonUploadOptions {
  /**
   * The JSON object to upload
   */
  json: object;
  /**
   * Name for the JSON file in Pinata
   */
  name?: string;
  /**
   * Pinata API JWT token for authentication
   */
  token: string;
}

/**
 * Uploads a JSON object to Pinata IPFS service
 * @param options - JSON upload configuration options
 * @returns Promise resolving to the Pinata API response with IPFS hash
 * @throws Error if upload fails
 */
async function uploadJsonToPinata({
  json,
  name,
  token,
}: PinataJsonUploadOptions): Promise<PinataResponse> {
  try {
    const data = JSON.stringify({
      pinataContent: json,
      pinataMetadata: { name: name || "metadata.json" },
    });

    const res = await axios.post(
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      data,
      {
        headers: {
          'Content-Type': `application/json`,
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data as PinataResponse;
  } catch (error) {
    console.error(`Error uploading JSON to Pinata: ${error}`);
    throw error;
  }
}

// Example usage:
//
// Node.js:
// import path from 'path';
// import { uploadToPinata, uploadJsonToPinata } from 'arcraft';
//
// const result = await uploadToPinata({
//   file: path.resolve('./assets/example.jpg'),
//   name: 'example.jpg',
//   token: process.env.PINATA_API_TOKEN || '',
// });
//
// Browser:
// import { uploadToPinata } from 'arcraft';
//
// const fileInput = document.getElementById('fileInput') as HTMLInputElement;
// const file = fileInput.files[0];
// const result = await uploadToPinata({
//   file: file,
//   name: 'example.jpg',
//   token: 'YOUR_PINATA_JWT_TOKEN',
// });

export { uploadToPinata, uploadJsonToPinata };
