import { Algodv2, Indexer } from "algosdk";
import { Network } from "./types";
import { networks } from "./const";

const getAlgodClient = (network: Network) => {
    const config = networks[network];
    return new Algodv2(config.algod.token, config.algod.server, config.algod.port);
}

const getIndexerClient = (network: Network) => {
    const config = networks[network];
  return new Indexer(config.indexer.token, config.indexer.server, config.indexer.port);
};

export { getAlgodClient, getIndexerClient };

