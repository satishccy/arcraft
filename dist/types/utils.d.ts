import { Algodv2, Indexer } from "algosdk";
import { Network } from "./types";
declare const getAlgodClient: (network: Network) => Algodv2;
declare const getIndexerClient: (network: Network) => Indexer;
export { getAlgodClient, getIndexerClient };
