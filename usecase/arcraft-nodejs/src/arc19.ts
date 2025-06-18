import { Arc19, IPFS } from "arcraft";
import algosdk, { makeBasicAccountTransactionSigner } from "algosdk";
import path from "path";
import { PINATA_JWT, MNEMONIC } from "./config";

async function main() {
  const ipfs = new IPFS("pinata", {
    provider: "pinata",
    jwt: PINATA_JWT,
  });

  const account = algosdk.mnemonicToSecretKey(
    MNEMONIC
  );

  const arc19 = await Arc19.create({
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
  console.log(`Created ARC19 NFT:\nId: ${arc19.assetId}\nTransaction ID: ${arc19.transactionId}\n\n`);

  const updated = await Arc19.update({
    assetId: arc19.assetId,
    manager: {
      address: account.addr.toString(),
      signer: makeBasicAccountTransactionSigner(account),
    },
    ipfs,
    image: {
      file: path.resolve(__dirname, "./images/test.png"), // Pass File Object in frontend
      name: "test.png",
    }, // only pass image if you want to update it
    properties: { from: "arcraft", name: "test" }, // only pass properties if you want to update them
    network: "testnet",
  });
  console.log(`Updated ARC19 NFT:\nTransaction ID: ${updated.transactionId}\n\n`);

  const existingAsset = await Arc19.fromId(arc19.assetId, "testnet"); // Get existing asset
  const metadataVersions = await Arc19.getMetadataVersions(arc19.assetId, "testnet"); // Get metadata versions
  console.log(`Metadata Versions: ${JSON.stringify(metadataVersions)}\n`);

  const resolvedUrl = Arc19.resolveUrl(existingAsset.getUrl(),existingAsset.getReserve()); // Get resolved URL
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

  const metadataResolvedUrl = existingAsset.getMetadataUrl();
  // Get Resolved URL of metadata.json
  console.log(`Metadata Resolved URL: ${metadataResolvedUrl}\n`);

  const isArc19 = Arc19.isArc19(existingAsset.getUrl()); 
  // Check if asset is ARC19
  console.log(`Is ARC19: ${isArc19}\n`);

  const isValidUrl = Arc19.hasValidUrl(existingAsset.getUrl()); 
  // Check if URL is valid
  console.log(`Is Valid URL: ${isValidUrl}\n`);
}

main();
