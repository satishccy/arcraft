/**
 * Utility functions for working with Algorand clients
 * @module utils
 */
import { Algodv2, Indexer } from "algosdk";
import { Network } from "./types";
/**
 * Gets an Algorand client instance for the specified network
 * @param network - The network to connect to
 * @returns An Algodv2 client instance
 */
declare const getAlgodClient: (network: Network) => Algodv2;
/**
 * Gets an Indexer client instance for the specified network
 * @param network - The network to connect to
 * @returns An Indexer client instance
 */
declare const getIndexerClient: (network: Network) => Indexer;
export { getAlgodClient, getIndexerClient };
