import { Arc54 } from 'arcraft';
import algosdk, { makeBasicAccountTransactionSigner } from 'algosdk';
import { MNEMONIC } from './config';

async function main() {
  const sender = algosdk.mnemonicToSecretKey(MNEMONIC);
  const assetId = 10458941;

  const assetBurnedPrev = await Arc54.getBurnedAmount('testnet', assetId);
  console.log(`Prev burned amount of asset ${assetId}: ${assetBurnedPrev}`);

  const result = await Arc54.burnAsset('testnet', assetId, 1000000, {
    address: sender.addr.toString(),
    signer: makeBasicAccountTransactionSigner(sender),
  });
  console.log(`Burned asset ${assetId} amount: 1000000 txid: ${result}`);

  const assetBurnedAfter = await Arc54.getBurnedAmount('testnet', assetId);
  console.log(`After burned amount of asset ${assetId}: ${assetBurnedAfter}`);
}
main();
