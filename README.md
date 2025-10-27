# Arcraft

[![npm version](https://badge.fury.io/js/arcraft.svg)](https://badge.fury.io/js/arcraft)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive JavaScript/TypeScript SDK for working with Algorand ARC (Algorand Request for Comments) standards. Supports both Node.js and browser environments with utilities for creating, managing, and querying NFTs and blockchain data.

View the documentation [here](https://satishccy.github.io/arcraft/).

## 📋 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Supported ARC Standards](#-supported-arc-standards)
- [Quick Start](#-quick-start)
- [IPFS Integration](#-ipfs-integration)
- [API Reference](#-api-reference)
- [Examples](#-examples)
- [Requirements](#-requirements)
- [API Documentation](#-api-documentation)
- [Development](#-development)
- [Contributing](#-contributing)
- [License](#-license)
- [Links](#-links)
- [Acknowledgments](#-acknowledgments)

## ✨ Features

### **Multi-ARC Support**

- **ARC-3**: Create and manage NFTs with external metadata on IPFS
- **ARC-19**: Advanced NFTs with template-based IPFS URIs and updatable metadata
- **ARC-69**: NFTs with embedded metadata in transaction notes
- **ARC-82**: Query blockchain data using standardized URI schemes

### **IPFS Integration**

- **Multiple Providers**: Support for Pinata and Filebase
- **Cross-Platform**: Works in both Node.js and browser environments
- **Seamless Upload**: File and JSON metadata uploading with automatic CID generation

### **Core Features**

- **Network Support**: Mainnet, Testnet, and Localnet compatibility
- **Asset Management**: Comprehensive Algorand Standard Asset utilities
- **TypeScript Support**: Full type definitions for better development experience
- **Error Handling**: Robust error handling and validation

## 📦 Installation

```bash
npm install arcraft
```

## 🎯 Supported ARC Standards

### ARC-3: NFT Standard with External Metadata

Traditional NFT standard where metadata is stored externally (typically on IPFS) and referenced via URL.

### ARC-19: Advanced NFT Standard

Enhanced NFT standard with template-based IPFS URIs that allow for more efficient storage and updatable metadata through reserve address manipulation.

### ARC-69: Embedded Metadata NFT Standard

NFT standard where metadata is embedded directly in transaction notes, eliminating the need for external storage.

### ARC-82: Blockchain Data Query Standard

URI scheme standard for querying application and asset data directly from the Algorand blockchain.

## 🚀 Quick Start

### Basic ARC-3 NFT Creation

```javascript
import { Arc3, IPFS } from 'arcraft';
import algosdk, { makeBasicAccountTransactionSigner } from 'algosdk';

async function createARC3NFT() {
  // Initialize IPFS provider
  const ipfs = new IPFS('pinata', {
    provider: 'pinata',
    jwt: 'YOUR_PINATA_JWT_TOKEN',
  });

  // Create account from mnemonic
  const account = algosdk.mnemonicToSecretKey('your mnemonic phrase here');

  // Create ARC-3 NFT
  const result = await Arc3.create({
    name: 'My First NFT',
    unitName: 'MYNFT',
    creator: {
      address: account.addr,
      signer: makeBasicAccountTransactionSigner(account),
    },
    ipfs,
    image: {
      file: './artwork.jpg', // Node.js: file path, Browser: File object
      name: 'artwork.jpg',
    },
    properties: {
      description: 'My first NFT using Arcraft',
      collection: 'Test Collection',
      traits: [
        { trait_type: 'Color', value: 'Blue' },
        { trait_type: 'Rarity', value: 'Common' },
      ],
    },
    network: 'testnet',
  });

  console.log(`NFT Created! Asset ID: ${result.assetId}`);
}
```

### ARC-19 NFT with Updatable Metadata

```javascript
import { Arc19, IPFS } from 'arcraft';

async function createARC19NFT() {
  const ipfs = new IPFS('filebase', {
    provider: 'filebase',
    token: 'YOUR_FILEBASE_TOKEN',
  });

  const account = algosdk.mnemonicToSecretKey('your mnemonic phrase here');

  // Create ARC-19 NFT
  const result = await Arc19.create({
    name: 'Updatable NFT',
    unitName: 'UPNFT',
    creator: {
      address: account.addr,
      signer: makeBasicAccountTransactionSigner(account),
    },
    ipfs,
    image: {
      file: './artwork.jpg',
      name: 'artwork.jpg',
    },
    properties: {
      description: 'An NFT with updatable metadata',
      version: '1.0.0',
    },
    network: 'testnet',
  });

  console.log(`ARC-19 NFT Created! Asset ID: ${result.assetId}`);

  // Later, update the NFT metadata
  await Arc19.update({
    manager: {
      address: account.addr,
      signer: makeBasicAccountTransactionSigner(account),
    },
    properties: {
      description: 'Updated NFT description',
      version: '2.0.0',
    },
    assetId: result.assetId,
    ipfs,
    network: 'testnet',
  });
}
```

### ARC-69 NFT with Embedded Metadata

```javascript
import { Arc69, IPFS } from 'arcraft';

async function createARC69NFT() {
  const ipfs = new IPFS('pinata', {
    provider: 'pinata',
    jwt: 'YOUR_PINATA_JWT_TOKEN',
  });

  const account = algosdk.mnemonicToSecretKey('your mnemonic phrase here');

  // Create ARC-69 NFT (metadata stored in transaction notes)
  const result = await Arc69.create({
    name: 'Embedded Metadata NFT',
    unitName: 'EMNFT',
    creator: {
      address: account.addr,
      signer: makeBasicAccountTransactionSigner(account),
    },
    ipfs,
    image: {
      file: './image.png',
      name: 'image.png',
    },
    properties: {
      standard: 'arc69',
      description: 'NFT with metadata in transaction notes',
      external_url: 'https://example.com',
      attributes: [
        { trait_type: 'Background', value: 'Sunset' },
        { trait_type: 'Character', value: 'Robot' },
      ],
    },
    network: 'testnet',
  });

  console.log(`ARC-69 NFT Created! Asset ID: ${result.assetId}`);
}
```

### ARC-82 Blockchain Queries

```javascript
import { Arc82 } from 'arcraft';

async function queryBlockchainData() {
  // Parse an ARC-82 URI
  const uri = 'algorand://app/123456?box=YWNjb3VudA==&global=dG90YWw=';
  const parsed = Arc82.parse(uri);

  console.log('Parsed URI:', parsed);

  // Query application data
  const appResult = await Arc82.queryApplication(parsed, 'mainnet');
  console.log('Application Data:', appResult);

  // Query asset data
  const assetUri = 'algorand://asset/789012?total=true&decimals=true&url=true';
  const assetParsed = Arc82.parse(assetUri);
  const assetResult = await Arc82.queryAsset(assetParsed, 'mainnet');

  console.log('Asset Data:', assetResult);

  // Build URIs programmatically
  const newAppUri = Arc82.buildAppUri(123456, {
    box: ['YWNjb3VudA=='],
    global: ['dG90YWw='],
    tealcode: true,
  });

  console.log('Built URI:', newAppUri);
}
```

## 🗂️ IPFS Integration

### Supported Providers

#### Pinata

```javascript
import { IPFS, uploadToPinata } from 'arcraft';

// Using IPFS class
const ipfs = new IPFS('pinata', {
  provider: 'pinata',
  jwt: 'YOUR_PINATA_JWT_TOKEN',
});

// Direct upload function
const result = await uploadToPinata({
  file: './image.jpg', // Node.js: path, Browser: File object
  name: 'my-image.jpg',
  token: 'YOUR_PINATA_JWT_TOKEN',
});

console.log(`IPFS Hash: ${result.IpfsHash}`);
```

#### Filebase

```javascript
import { IPFS, uploadToFilebase } from 'arcraft';

// Using IPFS class
const ipfs = new IPFS('filebase', {
  provider: 'filebase',
  token: 'YOUR_FILEBASE_TOKEN',
});

// Direct upload function
const result = await uploadToFilebase({
  file: './document.pdf',
  name: 'document.pdf',
  token: 'YOUR_FILEBASE_TOKEN',
});

console.log(`IPFS CID: ${result.cid}`);
```

### Universal IPFS Interface

```javascript
// Both providers implement the same interface
async function uploadWithProvider(ipfs) {
  // Upload file
  const imageCid = await ipfs.upload(file, 'filename.jpg');

  // Upload JSON metadata
  const metadataCid = await ipfs.uploadJson(
    {
      name: 'My NFT',
      description: 'A beautiful NFT',
      image: `ipfs://${imageCid}`,
    },
    'metadata.json'
  );

  return { imageCid, metadataCid };
}
```

## 📖 API Reference

### Arc3 Class

```javascript
// Create new ARC-3 NFT
const result = await Arc3.create(options);

// Load existing ARC-3 NFT
const nft = await Arc3.fromId(assetId, network);

// Check if asset is ARC-3 compliant
const isCompliant = nft.isArc3();

// Get metadata
const metadata = nft.getMetadata();

// Get image URL
const imageUrl = nft.getImageUrl();

// Get image as base64
const base64Image = await nft.getImageBase64();
```

### Arc19 Class

```javascript
// Create new ARC-19 NFT
const result = await Arc19.create(options);

// Load existing ARC-19 NFT
const nft = await Arc19.fromId(assetId, network);

// Update NFT metadata
await Arc19.update(updateOptions);

// Get all metadata versions
const versions = await Arc19.getMetadataVersions(assetId, network);

// Check if URL is valid ARC-19 format
const isValid = Arc19.hasValidUrl(url);

// Resolve template URL to actual IPFS URL
const resolvedUrl = Arc19.resolveUrl(templateUrl, reserveAddress);
```

### Arc69 Class

```javascript
// Create new ARC-69 NFT
const result = await Arc69.create(options);

// Load existing ARC-69 NFT
const nft = await Arc69.fromId(assetId, network);

// Update NFT metadata
await Arc69.update(updateOptions);

// Get all metadata versions
const versions = await Arc69.getMetadataVersions(assetId, network);

// Check if asset has valid ARC-69 metadata
const hasValidMetadata = await Arc69.hasValidMetadata(assetId, network);
```

### Arc82 Class

```javascript
// Parse ARC-82 URI
const parsed = Arc82.parse(uri);

// Query application data
const appData = await Arc82.queryApplication(parsed, network);

// Query asset data
const assetData = await Arc82.queryAsset(parsed, network);

// Build application URI
const appUri = Arc82.buildAppUri(appId, queryParams);

// Build asset URI
const assetUri = Arc82.buildAssetUri(assetId, queryParams);

// Validate URI format
const isValid = Arc82.isValidArc82Uri(uri);

// Extract ID from URI
const id = Arc82.extractId(uri);

// Extract type from URI
const type = Arc82.extractType(uri);
```

### IPFS Class

```javascript
// Initialize IPFS with provider
const ipfs = new IPFS(provider, config);

// Upload file
const cid = await ipfs.upload(file, fileName);

// Upload JSON
const jsonCid = await ipfs.uploadJson(jsonObject, fileName);
```

### CoreAsset Class

```javascript
// Load asset by ID
const asset = await CoreAsset.fromId(assetId, network);

// Get asset properties
const creator = asset.getCreator();
const manager = asset.getManager();
const reserve = asset.getReserve();
const freeze = asset.getFreeze();
const clawback = asset.getClawback();
const name = asset.getName();
const unitName = asset.getUnitName();
const url = asset.getUrl();
const total = asset.getTotalSupply();
const decimals = asset.getDecimals();
const defaultFrozen = asset.getDefaultFrozen();
const metadataHash = asset.getMetadataHash();
```

## 💡 Examples

### Cross-Platform File Upload

```javascript
// Node.js Environment
import { uploadToPinata } from 'arcraft';
import path from 'path';

const nodeUpload = await uploadToPinata({
  file: path.resolve('./assets/image.png'),
  name: 'image.png',
  token: 'YOUR_TOKEN',
});

// Browser Environment
const browserUpload = async (fileInput) => {
  const file = fileInput.files[0];
  const result = await uploadToPinata({
    file: file,
    name: file.name,
    token: 'YOUR_TOKEN',
  });
  return result;
};
```

### Batch NFT Creation

```javascript
import { Arc3, IPFS } from 'arcraft';

async function createNFTCollection() {
  const ipfs = new IPFS('pinata', {
    provider: 'pinata',
    jwt: 'YOUR_JWT',
  });

  const account = algosdk.mnemonicToSecretKey('your mnemonic');
  const creator = {
    address: account.addr,
    signer: makeBasicAccountTransactionSigner(account),
  };

  const artworks = [
    {
      file: './art1.png',
      name: 'Sunset Dreams',
      traits: [{ trait_type: 'Theme', value: 'Nature' }],
    },
    {
      file: './art2.png',
      name: 'City Lights',
      traits: [{ trait_type: 'Theme', value: 'Urban' }],
    },
    {
      file: './art3.png',
      name: 'Ocean Waves',
      traits: [{ trait_type: 'Theme', value: 'Water' }],
    },
  ];

  const results = [];

  for (const [index, artwork] of artworks.entries()) {
    const result = await Arc3.create({
      name: artwork.name,
      unitName: `ART${index + 1}`,
      creator,
      ipfs,
      image: artwork.file,
      imageName: `${artwork.name.replace(/\s+/g, '_').toLowerCase()}.png`,
      properties: {
        description: `Artwork #${index + 1} from the Dreams Collection`,
        collection: 'Dreams Collection',
        edition: index + 1,
        total_editions: artworks.length,
        attributes: artwork.traits,
      },
      network: 'testnet',
    });

    results.push(result);
    console.log(`Created NFT #${index + 1}: Asset ID ${result.assetId}`);
  }

  return results;
}
```

### Complex ARC-82 Queries

```javascript
import { Arc82 } from 'arcraft';

async function complexBlockchainQuery() {
  // Query multiple box keys and global state
  const appUri = Arc82.buildAppUri(123456, {
    box: [
      Arc82.encodeBase64Url('user_balance'),
      Arc82.encodeBase64Url('total_supply'),
      Arc82.encodeBase64Url('admin_settings'),
    ],
    global: [
      Arc82.encodeBase64Url('contract_version'),
      Arc82.encodeBase64Url('paused'),
    ],
    local: [
      {
        key: Arc82.encodeBase64Url('user_score'),
        algorandaddress: 'ALGORAND_ADDRESS_HERE',
      },
    ],
    tealcode: true,
  });

  console.log('Generated URI:', appUri);

  const parsed = Arc82.parse(appUri);
  const result = await Arc82.queryApplication(parsed, 'mainnet');

  // Process results
  if (result.success) {
    console.log('Box storage results:', result.boxes);
    console.log('Global state results:', result.global);
    console.log('Local state results:', result.local);
    console.log('TEAL code:', result.tealCode);
  } else {
    console.error('Query failed:', result.error);
  }
}
```

### Metadata Version Tracking

```javascript
import { Arc19, Arc69 } from 'arcraft';

async function trackMetadataVersions(assetId, network) {
  try {
    // Get ARC-19 metadata versions
    const arc19Versions = await Arc19.getMetadataVersions(assetId, network);
    console.log('ARC-19 Metadata Versions:', arc19Versions);

    // Get ARC-69 metadata versions
    const arc69Versions = await Arc69.getMetadataVersions(assetId, network);
    console.log('ARC-69 Metadata Versions:', arc69Versions);

    // Compare versions and show evolution
    if (arc19Versions.length > 0) {
      console.log('ARC-19 Evolution:');
      arc19Versions.forEach((version, index) => {
        console.log(`Version ${index + 1}:`, {
          timestamp: version.timestamp,
          metadataHash: version.metadataHash,
          changes: version.properties,
        });
      });
    }
  } catch (error) {
    console.error('Error tracking versions:', error);
  }
}
```

## 📋 Requirements

### Environment Requirements

- **Node.js**: >= 18.0.0 (for Node.js usage)
- **Browser**: Modern browsers with ES6 modules support
- **TypeScript**: >= 5.0.0 (for TypeScript projects)

### Algorand Requirements

- Algorand account with sufficient funds for asset creation
- Access to Algorand node (Algod) and Indexer services
- Network connectivity to chosen Algorand network (mainnet/testnet/localnet)

### IPFS Provider Requirements

Choose at least one IPFS provider:

#### Pinata

- Pinata account and JWT token
- Sign up at [pinata.cloud](https://pinata.cloud)

#### Filebase

- Filebase account and API token
- Sign up at [filebase.com](https://filebase.com)

### Development Requirements

- Git for version control
- npm or yarn package manager
- Code editor with TypeScript support (recommended: VS Code)

## 📚 API Documentation

### TypeDoc Documentation

This package is fully documented with TypeDoc comments. You can generate and view the documentation in several ways:

#### View Online Documentation

Visit our comprehensive online documentation: [https://satishccy.github.io/arcraft/](https://satishccy.github.io/arcraft/)

#### Generate Local Documentation

```bash
# Clone the repository
git clone https://github.com/satishccy/arcraft.git
cd arcraft

# Install dependencies
npm install

# Generate TypeDoc documentation
npm run docs

# Open the generated documentation
open docs/index.html
```

#### In-Editor Documentation

If you're using VS Code or another TypeScript-aware editor, you'll get:

- **IntelliSense**: Auto-completion with parameter hints
- **Type Information**: Hover over any function to see its signature
- **Parameter Help**: Detailed information about function parameters
- **Return Types**: Clear indication of what each function returns

#### Documentation Structure

The generated TypeDoc documentation includes:

- **Classes**: All main classes (CoreAsset, Arc3, Arc19, Arc69, Arc82, IPFS, etc.)
- **Interfaces**: Type definitions and data structures
- **Functions**: Utility functions and helper methods
- **Enums**: Constants and enumerated values
- **Modules**: Organized by functionality (arc3, arc19, arc69, arc82, ipfs, utils, etc.)
- **Examples**: Code examples for common use cases
- **Cross-references**: Links between related types and functions

### Core API Structure

The package is organized into logical modules:

#### Core Classes

- **`CoreAsset`**: Base class for all Algorand Standard Assets
- **`Arc3`**: ARC-3 NFT implementation with external metadata
- **`Arc19`**: ARC-19 NFT implementation with template IPFS URIs
- **`Arc69`**: ARC-69 NFT implementation with embedded metadata
- **`Arc82`**: ARC-82 blockchain data query implementation

#### Utility Modules

- **`IPFS`**: Universal IPFS integration supporting multiple providers
- **`utils`**: Algorand client utilities and helper functions
- **`mimeUtils`**: Cross-platform MIME type detection
- **`AssetFactory`**: Smart factory for creating appropriate asset instances

#### Provider Integrations

- **`pinata`**: Pinata IPFS service integration
- **`filebase`**: Filebase IPFS service integration

### TypeScript Support

Full TypeScript support with:

- **Strict Type Checking**: All functions have proper type annotations
- **Interface Definitions**: Clear interfaces for all data structures
- **Generic Types**: Type-safe operations across different asset types
- **Enum Support**: Strongly-typed enums for constants and options

### Error Handling

Comprehensive error handling with custom error classes:

- **`Arc82ParseError`**: Thrown when ARC-82 URIs cannot be parsed
- **`Arc82QueryError`**: Thrown when blockchain queries fail
- Standard JavaScript errors for network and validation issues

## 🛠️ Development

For local development:

```bash
# Install deps
npm install

# Build the library bundles
npm run build

# Lint and format
npm run lint:fix
npm run format

# Generate docs (optional)
npm run docs
```

See `CONTRIBUTING.md` for full details and PR guidelines. Example apps are in `usecase/`.

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/satishccy/arcraft.git`
3. Install dependencies: `npm install`
4. Create a feature branch: `git checkout -b feature/amazing-feature`

### Development Workflow

1. Make your changes
2. Add tests for new functionality
3. Run tests: `npm test`
4. Run linter: `npm run lint:fix`
5. Format code: `npm run format`
6. Update documentation: `npm run docs`
7. Commit your changes: `git commit -m 'Add amazing feature'`
8. Push to your branch: `git push origin feature/amazing-feature`
9. Open a Pull Request

### Documentation Standards

When contributing, please ensure all code is properly documented:

#### TypeDoc Comment Requirements

All public functions, classes, and interfaces must have:

````typescript
/**
 * Brief description of what the function does
 * @param paramName - Description of the parameter
 * @param optionalParam - Description (optional)
 * @returns Description of return value
 * @throws Error description when function can throw
 * @example
 * ```typescript
 * // Usage example
 * const result = await myFunction('example');
 * ```
 */
````

#### Documentation Guidelines

- **Functions**: Describe purpose, parameters, return values, and potential errors
- **Classes**: Describe the class purpose and main functionality
- **Interfaces**: Document each property and its purpose
- **Examples**: Include practical usage examples for complex functions
- **Modules**: Each file should have a module-level description

#### Code Style Requirements

- Follow existing TypeScript style conventions
- Use meaningful variable and function names
- Add JSDoc comments for all public APIs
- Include error handling and validation

### Contribution Guidelines

- Follow the existing code style and conventions
- Add comprehensive tests for new features
- Update documentation for API changes
- Keep commits atomic and well-described
- Ensure all tests pass before submitting PR
- Update TypeDoc comments for any API changes

### Areas for Contribution

- Additional ARC standard implementations
- More IPFS provider integrations
- Performance optimizations
- Browser compatibility improvements
- Documentation enhancements
- Example applications
- Test coverage improvements
- Error handling enhancements

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Documentation**: [https://satishccy.github.io/arcraft/](https://satishccy.github.io/arcraft/)
- **GitHub Repository**: [https://github.com/satishccy/arcraft](https://github.com/satishccy/arcraft)
- **npm Package**: [https://www.npmjs.com/package/arcraft](https://www.npmjs.com/package/arcraft)
- **Issues**: [https://github.com/satishccy/arcraft/issues](https://github.com/satishccy/arcraft/issues)
- **TypeDoc Configuration**: [./typedoc.config.json](./typedoc.config.json)

## 🙏 Acknowledgments

- Algorand Foundation for the ARC standards
- The Algorand developer community
- Contributors to the algosdk-js library
- IPFS and related decentralized storage providers
- TypeDoc community for excellent documentation tooling

---

**Built with ❤️ for the Algorand ecosystem**
