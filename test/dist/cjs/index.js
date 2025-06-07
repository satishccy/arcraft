"use strict";
/**
 * @module arcraft
 *
 * Main entry point for the Arcraft SDK, providing utilities for working with Algorand ARC standards.
 * This package is designed for Node.js backends and provides tools for NFT creation,
 * IPFS integration, and more.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IPFS = exports.Arc3 = void 0;
__exportStar(require("./coreAsset"), exports);
__exportStar(require("./arc3"), exports);
var arc3_1 = require("./arc3");
Object.defineProperty(exports, "Arc3", { enumerable: true, get: function () { return arc3_1.Arc3; } });
var ipfs_1 = require("./ipfs");
Object.defineProperty(exports, "IPFS", { enumerable: true, get: function () { return ipfs_1.IPFS; } });
__exportStar(require("./types"), exports);
__exportStar(require("./utils"), exports);
__exportStar(require("./ipfs"), exports);
__exportStar(require("./pinata"), exports);
//# sourceMappingURL=index.js.map