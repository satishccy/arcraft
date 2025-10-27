import { Arc59 } from 'arcraft';
import algosdk, { makeBasicAccountTransactionSigner } from 'algosdk';
import { MNEMONIC, MNEMONIC2 } from './config';

async function main() {
  const sender = algosdk.mnemonicToSecretKey(MNEMONIC);
  const receiver = algosdk.mnemonicToSecretKey(MNEMONIC2);
  const claimingAssetId = 10458941;
  const rejectingAssetId = 513945448;

  const prevAssetInbox = await Arc59.getAssetsInInbox({
    network: 'testnet',
    receiver: receiver.addr.toString(),
  });
  console.log(`Prev asset inbox of receiver: length: ${prevAssetInbox.length}`);
  prevAssetInbox.forEach((asset) => {
    console.log(`   Asset ID: ${asset.assetId}, Amount: ${asset.amount}`);
  });

  const result = await Arc59.sendAsset({
    network: 'testnet',
    assetId: claimingAssetId,
    amount: 1000000,
    receiver: receiver.addr.toString(),
    sender: {
      address: sender.addr.toString(),
      signer: makeBasicAccountTransactionSigner(sender),
    },
  });
  console.log(
    `Sent asset ${claimingAssetId} to receiver's inbox txid: ${result}`
  );

  const result2 = await Arc59.sendAsset({
    network: 'testnet',
    assetId: rejectingAssetId,
    amount: 2000000,
    receiver: receiver.addr.toString(),
    sender: {
      address: sender.addr.toString(),
      signer: makeBasicAccountTransactionSigner(sender),
    },
  });
  console.log(
    `Sent asset ${rejectingAssetId} to receiver's inbox txid: ${result2}`
  );

  const newAssetInbox = await Arc59.getAssetsInInbox({
    network: 'testnet',
    receiver: receiver.addr.toString(),
  });
  console.log(
    `asset inbox status of receiver after sending assets: length: ${newAssetInbox.length}`
  );
  newAssetInbox.forEach((asset) => {
    console.log(`   Asset ID: ${asset.assetId}, Amount: ${asset.amount}`);
  });

  const claimResult = await Arc59.claimAsset({
    network: 'testnet',
    receiver: {
      address: receiver.addr.toString(),
      signer: makeBasicAccountTransactionSigner(receiver),
    },
    assetId: claimingAssetId,
  });
  console.log(`Claimed asset ${claimingAssetId} txid: ${claimResult}`);

  const rejectResult = await Arc59.rejectAsset({
    network: 'testnet',
    receiver: {
      address: receiver.addr.toString(),
      signer: makeBasicAccountTransactionSigner(receiver),
    },
    assetId: rejectingAssetId,
  });
  console.log(`Rejected asset ${rejectingAssetId} txid: ${rejectResult}`);

  const newAssetInbox2 = await Arc59.getAssetsInInbox({
    network: 'testnet',
    receiver: receiver.addr.toString(),
  });
  console.log(
    `asset inbox status of receiver after claiming and rejecting assets: length: ${newAssetInbox2.length}`
  );
  newAssetInbox2.forEach((asset) => {
    console.log(`   Asset ID: ${asset.assetId}, Amount: ${asset.amount}`);
  });
}
main();
