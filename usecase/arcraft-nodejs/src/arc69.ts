import { Arc69, IPFS } from "arcraft";
import algosdk, { makeBasicAccountTransactionSigner } from "algosdk";
import path from "path";
import { PINATA_JWT, MNEMONIC } from "./config";

async function main() {
  const ipfs = new IPFS("pinata", {
    provider: "pinata",
    jwt: PINATA_JWT,
  });

  const account = algosdk.mnemonicToSecretKey(MNEMONIC);

  const arc69 = await Arc69.create({
    name: "Cool NFT",
    unitName: "CNFT",
    creator: {
      address: account.addr.toString(),
      signer: makeBasicAccountTransactionSigner(account), // Wallet Signer
    },
    ipfs, // IPFS Instance
    image: {
      file: path.resolve(__dirname, "./images/juan.webp"), // Pass File Object in frontend
      name: "juan.webp",
    },
    properties: { from: "arcraft" },
    network: "testnet",
    // ... can add more asset fields here (total,decimals,freeze,reserve,clawback,manager,defaultFrozen)
  });
  console.log(
    `Created ARC69 NFT:\nId: ${arc69.assetId}\nTransaction ID: ${arc69.transactionId}\n\n`
  );
  const updated = await Arc69.update({
    assetId: arc69.assetId,
    manager: {
      address: account.addr.toString(),
      signer: makeBasicAccountTransactionSigner(account),
    },
    properties: { from: "arcraft", name: "test" }, // properties to update
    network: "testnet",
  });
  console.log(
    `Updated ARC69 NFT:\nTransaction ID: ${updated.transactionId}\n\n`
  );

  const existingAsset = await Arc69.fromId(arc69.assetId, "testnet"); // Get existing asset
  const metadataVersions = await Arc69.getMetadataVersions(
    arc69.assetId,
    "testnet"
  ); // Get metadata versions
  console.log(`Metadata Versions: ${JSON.stringify(metadataVersions)}\n`);

  const resolvedUrl = Arc69.resolveUrl(existingAsset.getUrl()); // Get resolved URL
  console.log(`Resolved URL: ${resolvedUrl}\n`);

  const metadata = existingAsset.getMetadata();
  // Get metadata of the asset
  console.log(`Metadata: ${JSON.stringify(metadata)}\n`);

  const resolvedImageUrl = existingAsset.getImageUrl();
  // Get resolved image URL from metadata.json
  console.log(`Resolved Image URL: ${resolvedImageUrl}\n`);

  const imageBase64 = await existingAsset.getImageBase64();
  // Get image base64 for the image
  console.log(`Image Base64: ${imageBase64}\n`);

  const isArc69 = await Arc69.isArc69(
    existingAsset.getUrl(),
    existingAsset.getIndex(),
    "testnet"
  );
  // Check if asset is ARC69
  console.log(`Is ARC69: ${isArc69}\n`);

  const isValidMetadata = await Arc69.hasValidMetadata(
    existingAsset.getIndex(),
    "testnet"
  );
  // Check if metadata is valid
  console.log(`Is Valid Metadata: ${isValidMetadata}\n`);

  const isValidUrl = Arc69.hasValidUrl(existingAsset.getUrl());
  // Check if URL is valid
  console.log(`Is Valid URL: ${isValidUrl}\n`);
}

main();
