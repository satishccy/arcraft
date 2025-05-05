"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadJsonToPinata = exports.uploadToPinata = void 0;
/**
 * Universal Pinata file uploader that works across environments by accepting only Blob objects
 */
const fs_1 = __importDefault(require("fs"));
const form_data_1 = __importDefault(require("form-data"));
const axios_1 = __importDefault(require("axios"));
/**
 * Uploads a file to Pinata cloud storage
 * @param options Upload configuration options
 * @returns Promise resolving to the Pinata API response
 */
async function uploadToPinata({ file, name, token, }) {
    try {
        const formData = new form_data_1.default();
        const src = file;
        const fileStream = fs_1.default.createReadStream(src);
        formData.append('file', fileStream);
        const pinataMetadata = JSON.stringify({
            name: name,
        });
        formData.append('pinataMetadata', pinataMetadata);
        const pinataOptions = JSON.stringify({
            cidVersion: 0,
        });
        formData.append('pinataOptions', pinataOptions);
        const res = await axios_1.default.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
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
exports.uploadToPinata = uploadToPinata;
async function uploadJsonToPinata({ json, name, token, }) {
    try {
        const data = JSON.stringify({
            pinataContent: json,
            pinataMetadata: { name: name },
        });
        const res = await axios_1.default.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', data, {
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
exports.uploadJsonToPinata = uploadJsonToPinata;
//# sourceMappingURL=pinata.js.map