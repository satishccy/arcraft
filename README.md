# Arcraft

JavaScript SDK for ARC's utils in Algorand for Node.js backends.
View the documentation [here](https://satishccy.github.io/arcraft/).

## Description

Arcraft is a comprehensive SDK for working with Algorand's ARC standards in Node.js environments. It provides utilities for creating and managing NFTs according to the ARC-3 standard, interacting with IPFS for decentralized storage, and handling core Algorand assets.

## Installation

```bash
npm install arcraft
```

## Features

- **ARC-3 NFT Implementation**: Create, mint, and manage ARC-3 compliant NFTs
- **IPFS Integration**: Upload files and metadata to IPFS through Pinata
- **Core Asset Utilities**: Work with Algorand Standard Assets (ASAs)
- **Network Management**: Support for mainnet, testnet, and local networks

## Todo

- **ARC-19 NFT Implementation**: Create, mint, update and fetch all metadata version of ARC-19 compliant NFTs
- **ARC-82 URI Parser**: Parse ARC-82 Compatiable URI's and fetch data to corresponding URI

## Modules

The SDK consists of several modules:

- **Arc3**: Implementation of the Algorand ARC-3 standard for NFTs
- **CoreAsset**: Base functionality for Algorand assets
- **IPFS**: Integration with IPFS through various providers
- **Pinata**: Utilities for uploading files to Pinata/IPFS

## Examples

### Creating an ARC-3 NFT

```javascript
import { Arc3, IPFS } from 'arcraft';
import algosdk, { makeBasicAccountTransactionSigner } from 'algosdk';
import path from 'path';

async function mintNFT() {
  // Initialize IPFS with Pinata provider
  const ipfs = new IPFS('pinata', {
    provider: 'pinata',
    jwt: 'YOUR_PINATA_JWT_TOKEN',
  });

  // Create account from mnemonic
  const account = algosdk.mnemonicToSecretKey(
    'your mnemonic phrase here'
  );

  // Create ARC-3 NFT
  const result = await Arc3.create({
    name: 'My NFT',
    unitName: 'NFT',
    creator: {
      address: account.addr.toString(),
      signer: makeBasicAccountTransactionSigner(account),
    },
    ipfs,
    image: path.resolve('./assets/image.png'),
    imageName: 'image.png',
    properties: { 
      collection: 'My Collection',
      artist: 'Artist Name',
    },
    network: 'testnet',
    defaultFrozen: false,
  });

  console.log(`Minted ARC-3 NFT: ${result.txid}`);
  console.log(`Asset ID: ${result.assetId}`);

  // Load the created asset
  const asset = await Arc3.fromId(Number(result.assetId), 'testnet');
  console.log(`Metadata: ${JSON.stringify(asset.getMetadata())}`);
}
```

### Uploading Files to IPFS via Pinata

```javascript
import { uploadToPinata } from 'arcraft';
import path from 'path';

async function uploadAsset() {
  try {
    const result = await uploadToPinata({
      file: path.resolve('./assets/myImage.jpg'),
      name: 'myImage.jpg',
      token: 'YOUR_PINATA_API_TOKEN',
    });
    
    console.log('Uploaded to IPFS with hash:', result.IpfsHash);
    // Use this hash with ipfs:// protocol
    const ipfsUrl = `ipfs://${result.IpfsHash}`;
  } catch (error) {
    console.error('Upload failed:', error);
  }
}
```

### Working with Existing Assets

```javascript
import { CoreAsset, Arc3 } from 'arcraft';

async function getAssetInfo(assetId) {
  // Get basic asset info
  const asset = await CoreAsset.fromId(assetId, 'mainnet');
  
  // Get creator, name, and other properties
  console.log(`Asset Name: ${asset.getName()}`);
  console.log(`Creator: ${asset.getCreator()}`);
  console.log(`Total Supply: ${asset.getTotalSupply()}`);
  
  // Check if it's ARC-3 compliant
  const arc3Asset = await Arc3.fromId(assetId, 'mainnet');
  if (arc3Asset.isArc3()) {
    console.log('ARC-3 Metadata:', arc3Asset.getMetadata());
  } else {
    console.log('Not an ARC-3 compliant asset');
  }
}
```

## API Documentation

### Arc3 Class

The `Arc3` class extends `CoreAsset` with ARC-3 specific functionality:

- `static async create(options)`: Creates a new ARC-3 NFT
- `static async fromId(id, network)`: Loads an existing ARC-3 asset
- `isArc3()`: Checks if the asset is ARC-3 compliant
- `getMetadata()`: Gets the metadata associated with the asset

### IPFS Class

The `IPFS` class provides methods for interacting with IPFS:

- `upload(file, fileName)`: Uploads a file to IPFS
- `uploadJson(json, fileName)`: Uploads a JSON object to IPFS

### CoreAsset Class

The `CoreAsset` class provides methods for working with Algorand assets:

- `static async fromId(id, network)`: Creates a CoreAsset instance from an asset ID
- `getCreator()`, `getManager()`, etc.: Methods to access asset properties
- `getTotalSupply()`, `getAmountInDecimals()`: Methods for amount calculations

## Requirements

- Node.js >= 18.0.0
- Algorand account with funds for asset creation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
