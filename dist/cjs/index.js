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
exports.Arc82QueryError = exports.Arc82ParseError = exports.Arc82Utils = exports.Arc82 = exports.AssetFactory = exports.Arc69 = exports.Arc19 = exports.Arc3 = exports.CoreAsset = void 0;
// Export base classes and utilities first (no dependencies)
__exportStar(require("./types"), exports);
__exportStar(require("./utils"), exports);
__exportStar(require("./const"), exports);
__exportStar(require("./ipfs"), exports);
__exportStar(require("./pinata"), exports);
__exportStar(require("./filebase"), exports);
__exportStar(require("./mimeUtils"), exports);
// Export CoreAsset (base class, no dependencies on ARC classes)
var coreAsset_1 = require("./coreAsset");
Object.defineProperty(exports, "CoreAsset", { enumerable: true, get: function () { return coreAsset_1.CoreAsset; } });
// Export ARC classes (depend on CoreAsset but not each other)
var arc3_1 = require("./arc3");
Object.defineProperty(exports, "Arc3", { enumerable: true, get: function () { return arc3_1.Arc3; } });
var arc19_1 = require("./arc19");
Object.defineProperty(exports, "Arc19", { enumerable: true, get: function () { return arc19_1.Arc19; } });
var arc69_1 = require("./arc69");
Object.defineProperty(exports, "Arc69", { enumerable: true, get: function () { return arc69_1.Arc69; } });
// Export AssetFactory (depends on all ARC classes)
var assetFactory_1 = require("./assetFactory");
Object.defineProperty(exports, "AssetFactory", { enumerable: true, get: function () { return assetFactory_1.AssetFactory; } });
// Export ARC-82 (standalone)
var arc82_1 = require("./arc82");
Object.defineProperty(exports, "Arc82", { enumerable: true, get: function () { return arc82_1.Arc82; } });
Object.defineProperty(exports, "Arc82Utils", { enumerable: true, get: function () { return arc82_1.Arc82Utils; } });
Object.defineProperty(exports, "Arc82ParseError", { enumerable: true, get: function () { return arc82_1.Arc82ParseError; } });
Object.defineProperty(exports, "Arc82QueryError", { enumerable: true, get: function () { return arc82_1.Arc82QueryError; } });
//# sourceMappingURL=index.js.map