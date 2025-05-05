import { Algodv2, Indexer } from "algosdk";
import { networks } from "./const";
const getAlgodClient = (network) => {
    const config = networks[network];
    return new Algodv2(config.algod.token, config.algod.server, config.algod.port);
};
const getIndexerClient = (network) => {
    const config = networks[network];
    return new Indexer(config.indexer.token, config.indexer.server, config.indexer.port);
};
export { getAlgodClient, getIndexerClient };
//# sourceMappingURL=utils.js.map