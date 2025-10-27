import { Arc3, IPFS } from 'arcraft';
import algosdk, { makeBasicAccountTransactionSigner } from 'algosdk';
import path from 'path';
import { PINATA_JWT, MNEMONIC } from './config';

async function main() {
  const ipfs = new IPFS('pinata', {
    provider: 'pinata',
    jwt: PINATA_JWT,
  });

  const account = algosdk.mnemonicToSecretKey(MNEMONIC);

  const arc3 = await Arc3.create({
    name: 'Cool NFT',
    unitName: 'CNFT',
    creator: {
      address: account.addr.toString(),
      signer: makeBasicAccountTransactionSigner(account), // Wallet Signer - can use transactionSigner instead
    },
    ipfs, // IPFS Instance
    image: {
      file: path.resolve(__dirname, './images/juan.webp'), // Pass File Object in frontend
      name: 'juan.webp',
    },
    properties: { from: 'arcraft' },
    network: 'testnet',
    // ... can add more asset fields here (total,decimals,freeze,reserve,clawback,manager,defaultFrozen)
  });

  console.log(
    `Created ARC3 NFT:\nId: ${arc3.assetId}\nTransaction ID: ${arc3.transactionId}\n\n`
  );

  const existingAsset = await Arc3.fromId(arc3.assetId, 'testnet'); // Get existing asset
  const metadata = existingAsset.getMetadata(); // Get metadata
  console.log(`Metadata: ${JSON.stringify(metadata)}\n`);
  const resolvedImageUrl = existingAsset.getImageUrl(); // Get image URL
  console.log(`Resolved Image URL: ${resolvedImageUrl}\n`);
  const imageBase64 = await existingAsset.getImageBase64(); // Get image base64
  console.log(`Image Base64: ${imageBase64}\n`);

  const isArc3 = Arc3.isArc3(
    existingAsset.getName(),
    existingAsset.getUrl(),
    existingAsset.getIndex()
  ); // Check if asset is ARC3
  console.log(`Is ARC3: ${isArc3}\n`);

  const isValidName = Arc3.hasValidName(existingAsset.getName()); // Check if name is valid
  console.log(`Is Valid Name: ${isValidName}\n`);

  const isValidUrl = Arc3.hasValidUrl(
    existingAsset.getUrl(),
    existingAsset.getIndex()
  );
  // Check if URL is valid
  console.log(`Is Valid URL: ${isValidUrl}\n`);
}

main();
