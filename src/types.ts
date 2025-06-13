/**
 * Common type definitions used throughout the library
 * @module types
 */

/**
 * Supported Algorand networks
 */
type Network = 'mainnet' | 'testnet' | 'localnet';

/**
 * Configuration for connecting to Algorand networks
 */
type NetworkConfig = {
  /** Network name */
  name: Network;
  /** Algod (node) configuration */
  algod: {
    /** Server URL */
    server: string;
    /** Server port */
    port: number;
    /** API token */
    token: string;
  };
  /** Indexer configuration */
  indexer: {
    /** Server URL */
    server: string;
    /** Server port */
    port: number;
    /** API token */
    token: string;
  };
};

/**
 * Types of Algorand URI schemes supported by ARC-82.
 * Defines the supported resource types that can be queried via ARC-82 URIs.
 */
enum AlgorandUriType {
  /** Application resource type (algorand://app/{id}) */
  APPLICATION = 'app',
  /** Asset resource type (algorand://asset/{id}) */
  ASSET = 'asset',
}

/**
 * Application storage types supported in ARC-82.
 * Defines the different types of storage that can be queried for applications.
 */
enum AppStorageType {
  /** Box storage - key-value pairs stored in application boxes */
  BOX = 'box',
  /** Global storage - global state variables of the application */
  GLOBAL = 'global',
  /** Local storage - account-specific state variables */
  LOCAL = 'local',
  /** TEAL code - the application's approval and clear state programs */
  TEALCODE = 'tealcode',
}

/**
 * Asset parameter types supported in ARC-82.
 * Defines the asset parameters that can be queried from the blockchain.
 */
enum AssetParamType {
  /** Total supply of the asset */
  TOTAL = 'total',
  /** Number of decimal places for the asset */
  DECIMALS = 'decimals',
  /** Default frozen status for new asset holdings */
  FROZEN = 'frozen',
  /** Unit name/symbol of the asset */
  UNITNAME = 'unitname',
  /** Full name of the asset */
  ASSETNAME = 'assetname',
  /** URL associated with the asset */
  URL = 'url',
  /** Metadata hash of the asset */
  METADATAHASH = 'metadatahash',
  /** Manager address of the asset */
  MANAGER = 'manager',
  /** Reserve address of the asset */
  RESERVE = 'reserve',
  /** Freeze address of the asset */
  FREEZE = 'freeze',
  /** Clawback address of the asset */
  CLAWBACK = 'clawback',
}

/**
 * Interface for application query parameters.
 * Defines the structure for querying different types of application data.
 */
interface AppQueryParams {
  /** Box storage queries with base64url-encoded keys */
  box?: string[];
  /** Global storage queries with base64url-encoded keys */
  global?: string[];
  /** Local storage queries with base64url-encoded keys and associated addresses */
  local?: Array<{
    /** Base64url-encoded key for the local state */
    key: string;
    /** Algorand address whose local state to query */
    algorandaddress: string;
  }>;
  /** Request for TEAL code (approval and clear state programs) */
  tealcode?: boolean;
}

/**
 * Interface for asset query parameters.
 * Defines which asset parameters should be included in the query response.
 */
interface AssetQueryParams {
  /** Query total supply */
  total?: boolean;
  /** Query decimal places */
  decimals?: boolean;
  /** Query frozen status */
  frozen?: boolean;
  /** Query unit name */
  unitname?: boolean;
  /** Query asset name */
  assetname?: boolean;
  /** Query URL */
  url?: boolean;
  /** Query metadata hash */
  metadatahash?: boolean;
  /** Query manager address */
  manager?: boolean;
  /** Query reserve address */
  reserve?: boolean;
  /** Query freeze address */
  freeze?: boolean;
  /** Query clawback address */
  clawback?: boolean;
}

/**
 * Interface for parsed Algorand URI.
 * Represents the result of parsing an ARC-82 compliant URI.
 */
interface ParsedAlgorandUri {
  /** Type of URI (app or asset) */
  type: AlgorandUriType;
  /** ID of the application or asset */
  id: number;
  /** Query parameters for applications (only present if type is APPLICATION) */
  appParams?: AppQueryParams;
  /** Query parameters for assets (only present if type is ASSET) */
  assetParams?: AssetQueryParams;
  /** Original URI string that was parsed */
  originalUri: string;
}

/**
 * Interface for blockchain query configuration.
 * Defines connection parameters for querying the Algorand blockchain.
 */
interface BlockchainQueryConfig {
  /** Algod server URL */
  algodServer?: string;
  /** Algod server port */
  algodPort?: number;
  /** Algod API token */
  algodToken?: string;
  /** Network to query (mainnet, testnet, localnet) */
  network?: 'mainnet' | 'testnet' | 'localnet';
  /** Custom algod client instance */
  algodClient?: any; // Will be algosdk.Algodv2 when implemented
}

/**
 * Interface for box storage data.
 * Represents the result of querying box storage from an application.
 */
interface BoxStorageData {
  /** Base64url-encoded key */
  key: string;
  /** Decoded key as UTF-8 string */
  decodedKey: string;
  /** Raw value bytes as base64 */
  value: string | null;
  /** Decoded value as UTF-8 string (if valid UTF-8) */
  decodedValue?: string;
  /** Whether the box exists */
  exists: boolean;
  /** Error message if query failed */
  error?: string;
}

/**
 * Interface for global storage data.
 * Represents the result of querying global state from an application.
 */
interface GlobalStorageData {
  /** Base64url-encoded key */
  key: string;
  /** Decoded key as UTF-8 string */
  decodedKey: string;
  /** Raw value (bytes or uint) */
  value: Uint8Array | bigint | null;
  /** Value type (bytes or uint) */
  valueType: 'bytes' | 'uint' | null;
  /** Decoded value as UTF-8 string (if bytes and valid UTF-8) */
  decodedValue?: string;
  /** Whether the key exists */
  exists: boolean;
  /** Error message if query failed */
  error?: string;
}

/**
 * Interface for local storage data.
 * Represents the result of querying local state from an application for a specific account.
 */
interface LocalStorageData {
  /** Base64url-encoded key */
  key: string;
  /** Decoded key as UTF-8 string */
  decodedKey: string;
  /** Account address */
  address: string;
  /** Raw value (bytes or uint) */
  value: Uint8Array | bigint | null;
  /** Value type (bytes or uint) */
  valueType: 'bytes' | 'uint' | null;
  /** Decoded value as UTF-8 string (if bytes and valid UTF-8) */
  decodedValue?: string;
  /** Whether the key exists for this account */
  exists: boolean;
  /** Whether the account is opted into the app */
  isOptedIn: boolean;
  /** Error message if query failed */
  error?: string;
}

/**
 * Interface for TEAL code data.
 * Represents the result of querying TEAL programs from an application.
 */
interface TealCodeData {
  /** Approval program TEAL source code */
  approvalProgram?: string;
  /** Clear state program TEAL source code */
  clearStateProgram?: string;
  /** Approval program as base64-encoded bytes */
  approvalProgramB64?: string;
  /** Clear state program as base64-encoded bytes */
  clearStateProgramB64?: string;
  /** Error message if query failed */
  error?: string;
}

/**
 * Interface for application query result.
 * Represents the complete result of querying application data from the blockchain.
 */
interface AppQueryResult {
  /** Application ID that was queried */
  appId: number;
  /** Box storage results (if box parameters were requested) */
  boxes?: BoxStorageData[];
  /** Global storage results (if global parameters were requested) */
  global?: GlobalStorageData[];
  /** Local storage results (if local parameters were requested) */
  local?: LocalStorageData[];
  /** TEAL code results (if tealcode parameter was requested) */
  tealCode?: TealCodeData;
  /** Whether the application exists on the blockchain */
  exists: boolean;
  /** Overall query success status */
  success: boolean;
  /** Error message if query failed */
  error?: string;
}

/**
 * Interface for asset parameter data.
 * Contains the actual parameter values retrieved from an asset.
 */
interface AssetParameterData {
  /** Total supply of the asset */
  total?: number;
  /** Number of decimal places */
  decimals?: number;
  /** Default frozen status for new holdings */
  frozen?: boolean;
  /** Unit name/symbol of the asset */
  unitname?: string;
  /** Full name of the asset */
  assetname?: string;
  /** URL associated with the asset */
  url?: string;
  /** Metadata hash as base64-encoded string */
  metadatahash?: string;
  /** Manager address (can modify asset configuration) */
  manager?: string;
  /** Reserve address (receives unclaimed assets) */
  reserve?: string;
  /** Freeze address (can freeze/unfreeze asset holdings) */
  freeze?: string;
  /** Clawback address (can revoke asset holdings) */
  clawback?: string;
}

/**
 * Interface for asset query result.
 * Represents the complete result of querying asset data from the blockchain.
 */
interface AssetQueryResult {
  /** Asset ID that was queried */
  assetId: number;
  /** Asset parameter data that was retrieved */
  parameters: AssetParameterData;
  /** Whether the asset exists on the blockchain */
  exists: boolean;
  /** Overall query success status */
  success: boolean;
  /** Error message if query failed */
  error?: string;
}

export {
  Network,
  NetworkConfig,
  AlgorandUriType,
  AppStorageType,
  AssetParamType,
  AppQueryParams,
  AssetQueryParams,
  ParsedAlgorandUri,
  BlockchainQueryConfig,
  BoxStorageData,
  GlobalStorageData,
  LocalStorageData,
  TealCodeData,
  AppQueryResult,
  AssetParameterData,
  AssetQueryResult,
};
