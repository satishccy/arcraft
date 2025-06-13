/**
 * Universal MIME type utilities that work in both Node.js and browser environments
 * @module mimeUtils
 */

// Environment detection
const isNode = typeof window === 'undefined' && typeof process !== 'undefined' && process.versions?.node;

// Dynamic import for Node.js mime-types package
let mimeTypes: any;
if (isNode) {
  try {
    mimeTypes = require('mime-types');
  } catch (error) {
    // mime-types not available, will use fallback
  }
}

/**
 * Common MIME type mappings for browser environments
 */
const commonMimeTypes: Record<string, string> = {
  // Images
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.bmp': 'image/bmp',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.tiff': 'image/tiff',
  '.tif': 'image/tiff',
  
  // Videos
  '.mp4': 'video/mp4',
  '.avi': 'video/x-msvideo',
  '.mov': 'video/quicktime',
  '.wmv': 'video/x-ms-wmv',
  '.flv': 'video/x-flv',
  '.webm': 'video/webm',
  '.mkv': 'video/x-matroska',
  
  // Audio
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.m4a': 'audio/mp4',
  '.aac': 'audio/aac',
  '.flac': 'audio/flac',
  
  // Documents
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xls': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.ppt': 'application/vnd.ms-powerpoint',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  
  // Text
  '.txt': 'text/plain',
  '.html': 'text/html',
  '.htm': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.csv': 'text/csv',
  
  // Archives
  '.zip': 'application/zip',
  '.tar': 'application/x-tar',
  '.gz': 'application/gzip',
  '.rar': 'application/vnd.rar',
  '.7z': 'application/x-7z-compressed',
};

/**
 * Gets the file extension from a filename or file path
 * @param filename - The filename or path
 * @returns The file extension including the dot (e.g., '.jpg')
 */
function getFileExtension(filename: string): string {
  if (!filename || typeof filename !== 'string') {
    return '';
  }
  
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1 || lastDotIndex === filename.length - 1) {
    return '';
  }
  
  return filename.substring(lastDotIndex).toLowerCase();
}

/**
 * Universal MIME type lookup that works in both Node.js and browser environments
 * @param filename - The filename or path to get MIME type for
 * @returns The MIME type string, or 'application/octet-stream' as fallback
 */
export function lookup(filename: string): string {
  if (!filename || typeof filename !== 'string') {
    return 'application/octet-stream';
  }

  // In Node.js environment, use mime-types package if available
  if (isNode && mimeTypes && mimeTypes.lookup) {
    const mimeType = mimeTypes.lookup(filename);
    if (mimeType) {
      return mimeType;
    }
  }

  // Fallback to common MIME types mapping
  const extension = getFileExtension(filename);
  if (extension && commonMimeTypes[extension]) {
    return commonMimeTypes[extension];
  }

  // Default fallback
  return 'application/octet-stream';
}

/**
 * Gets MIME type from a File object (browser environment only)
 * @param file - The File object
 * @returns The MIME type from the file object, or lookup from filename as fallback
 */
export function lookupFromFile(file: File): string {
  // Use the file's native type if available and valid
  if (file.type && file.type !== '') {
    return file.type;
  }
  
  // Fallback to filename-based lookup
  return lookup(file.name);
}

/**
 * Universal MIME type utility object with methods similar to mime-types package
 */
export const mime = {
  lookup,
  lookupFromFile,
  getFileExtension,
};

export default mime; 