/**
 * Pinata IPFS service integration module that provides utilities for uploading files and JSON to Pinata.
 * @module pinata
 */
import fs from 'fs';
import FormData from 'form-data';
import axios from 'axios';

/**
 * Configuration options for uploading files to Pinata
 */
export interface PinataUploadOptions {
  /**
   * The file path to upload
   */
  file: string;
  /**
   * Name for the file in Pinata
   */
  name: string;
  /**
   * Pinata API JWT token for authentication
   */
  token: string;
}

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
 * Uploads a file to Pinata IPFS service
 * @param options - Upload configuration options
 * @returns Promise resolving to the Pinata API response with IPFS hash
 * @throws Error if upload fails
 */
async function uploadToPinata({
  file,
  name,
  token,
}: PinataUploadOptions): Promise<PinataResponse> {
  try {
    const formData = new FormData();
    const src = file;

    const fileStream = fs.createReadStream(src);
    formData.append('file', fileStream);

    const pinataMetadata = JSON.stringify({
      name: name,
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
    console.log(':ERROR', error);
    throw error;
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
  name: string;
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
      pinataMetadata: { name: name },
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
    console.log(':ERROR', error);
    throw error;
  }
}

// Example Node.js usage:
//
// import path from 'path';
// import fs from 'fs';
// import { uploadToPinata, uploadJsonToPinata } from 'arcraft';
//
// // Example 1: Upload using file path
// async function uploadFileUsingPath(): Promise<void> {
//   const filePath = path.resolve('./assets/example.jpg');
//
//   try {
//     const result = await uploadToPinata({
//       file: filePath,
//       name: 'example.jpg',
//       token: process.env.PINATA_API_TOKEN || '',
//     });
//     console.log("Upload successful:", result);
//     console.log("IPFS hash:", result.IpfsHash);
//   } catch (error) {
//     console.error("Upload failed:", error instanceof Error ? error.message : String(error));
//   }
// }


export { uploadToPinata, uploadJsonToPinata };
