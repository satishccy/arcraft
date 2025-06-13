
import { StorageAdapter, LOCAL_STORAGE_MNEMONIC_KEY } from "@txnlab/use-wallet-react";
import algosdk from "algosdk";


export const getLocalAccount = () => {
    const mnemonic = StorageAdapter.getItem(LOCAL_STORAGE_MNEMONIC_KEY);
    if (!mnemonic) {
        throw new Error("No Wallet found");
    }
    return algosdk.mnemonicToSecretKey(mnemonic);
}