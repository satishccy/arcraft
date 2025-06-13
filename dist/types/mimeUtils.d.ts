/**
 * Universal MIME type utilities that work in both Node.js and browser environments
 * @module mimeUtils
 */
/**
 * Gets the file extension from a filename or file path
 * @param filename - The filename or path
 * @returns The file extension including the dot (e.g., '.jpg')
 */
declare function getFileExtension(filename: string): string;
/**
 * Universal MIME type lookup that works in both Node.js and browser environments
 * @param filename - The filename or path to get MIME type for
 * @returns The MIME type string, or 'application/octet-stream' as fallback
 */
export declare function lookup(filename: string): string;
/**
 * Gets MIME type from a File object (browser environment only)
 * @param file - The File object
 * @returns The MIME type from the file object, or lookup from filename as fallback
 */
export declare function lookupFromFile(file: File): string;
/**
 * Universal MIME type utility object with methods similar to mime-types package
 */
export declare const mime: {
    lookup: typeof lookup;
    lookupFromFile: typeof lookupFromFile;
    getFileExtension: typeof getFileExtension;
};
export default mime;
