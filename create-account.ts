import algosdk from "algosdk";

const mnemonic = algosdk.generateAccount();

console.log(`Address: ${mnemonic.addr}`);
console.log(`Mnemonic: ${algosdk.secretKeyToMnemonic(mnemonic.sk)}`);