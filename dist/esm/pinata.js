/**
 * Universal Pinata file uploader that works across environments by accepting only Blob objects
 */
import fs from 'fs';
import FormData from 'form-data';
import axios from 'axios';
/**
 * Uploads a file to Pinata cloud storage
 * @param options Upload configuration options
 * @returns Promise resolving to the Pinata API response
 */
async function uploadToPinata({ file, name, token, }) {
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
        const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
            headers: {
                'Content-Type': `multipart/form-data`,
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    }
    catch (error) {
        console.log(':ERROR', error);
        throw error;
    }
}
async function uploadJsonToPinata({ json, name, token, }) {
    try {
        const data = JSON.stringify({
            pinataContent: json,
            pinataMetadata: { name: name },
        });
        const res = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', data, {
            headers: {
                'Content-Type': `application/json`,
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    }
    catch (error) {
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
//
// // Example 2: Upload using Buffer
// async function uploadFileUsingBuffer(): Promise<void> {
//   const fileBuffer = fs.readFileSync('./assets/example.jpg');
//
//   try {
//     const result = await uploadToPinata({
//       file: fileBuffer,
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
//# sourceMappingURL=pinata.js.map