import { Network, NetworkConfig } from './types';
declare const networks: Record<Network, NetworkConfig>;
declare const IPFS_GATEWAY = "https://ipfs.io/ipfs/";
export { networks, IPFS_GATEWAY };
