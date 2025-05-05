/**
 * Utility functions for working with Algorand clients
 * @module utils
 */
import { Algodv2, Indexer } from "algosdk";
import { networks } from "./const";
/**
 * Gets an Algorand client instance for the specified network
 * @param network - The network to connect to
 * @returns An Algodv2 client instance
 */
const getAlgodClient = (network) => {
    const config = networks[network];
    return new Algodv2(config.algod.token, config.algod.server, config.algod.port);
};
/**
 * Gets an Indexer client instance for the specified network
 * @param network - The network to connect to
 * @returns An Indexer client instance
 */
const getIndexerClient = (network) => {
    const config = networks[network];
    return new Indexer(config.indexer.token, config.indexer.server, config.indexer.port);
};
export { getAlgodClient, getIndexerClient };
//# sourceMappingURL=utils.js.map