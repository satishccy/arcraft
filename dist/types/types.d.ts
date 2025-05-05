type Network = 'mainnet' | 'testnet' | 'localnet';
type NetworkConfig = {
    name: Network;
    algod: {
        server: string;
        port: number;
        token: string;
    };
    indexer: {
        server: string;
        port: number;
        token: string;
    };
};
export { Network, NetworkConfig };
