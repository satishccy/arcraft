/**
 * Implementation of the Algorand ARC-82 standard for URI scheme blockchain information.
 * @module arc82
 *
 * This module provides utilities for parsing and constructing Algorand URIs
 * that query application and asset data on the Algorand blockchain.
 *
 * ARC-82 defines a standardized method for querying application and asset data
 * using URI format: algorand://app/{id} and algorand://asset/{id}
 *
 * @see https://arc.algorand.foundation/ARCs/arc-0082
 */
import { Network } from './types';
/**
 * Types of Algorand URI schemes supported by ARC-82.
 * Defines the supported resource types that can be queried via ARC-82 URIs.
 */
export declare enum AlgorandUriType {
    /** Application resource type (algorand://app/{id}) */
    APPLICATION = "app",
    /** Asset resource type (algorand://asset/{id}) */
    ASSET = "asset"
}
/**
 * Application storage types supported in ARC-82.
 * Defines the different types of storage that can be queried for applications.
 */
export declare enum AppStorageType {
    /** Box storage - key-value pairs stored in application boxes */
    BOX = "box",
    /** Global storage - global state variables of the application */
    GLOBAL = "global",
    /** Local storage - account-specific state variables */
    LOCAL = "local",
    /** TEAL code - the application's approval and clear state programs */
    TEALCODE = "tealcode"
}
/**
 * Asset parameter types supported in ARC-82.
 * Defines the asset parameters that can be queried from the blockchain.
 */
export declare enum AssetParamType {
    /** Total supply of the asset */
    TOTAL = "total",
    /** Number of decimal places for the asset */
    DECIMALS = "decimals",
    /** Default frozen status for new asset holdings */
    FROZEN = "frozen",
    /** Unit name/symbol of the asset */
    UNITNAME = "unitname",
    /** Full name of the asset */
    ASSETNAME = "assetname",
    /** URL associated with the asset */
    URL = "url",
    /** Metadata hash of the asset */
    METADATAHASH = "metadatahash",
    /** Manager address of the asset */
    MANAGER = "manager",
    /** Reserve address of the asset */
    RESERVE = "reserve",
    /** Freeze address of the asset */
    FREEZE = "freeze",
    /** Clawback address of the asset */
    CLAWBACK = "clawback"
}
/**
 * Interface for application query parameters.
 * Defines the structure for querying different types of application data.
 */
export interface AppQueryParams {
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
export interface AssetQueryParams {
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
export interface ParsedAlgorandUri {
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
export interface BlockchainQueryConfig {
    /** Algod server URL */
    algodServer?: string;
    /** Algod server port */
    algodPort?: number;
    /** Algod API token */
    algodToken?: string;
    /** Network to query (mainnet, testnet, localnet) */
    network?: 'mainnet' | 'testnet' | 'localnet';
    /** Custom algod client instance */
    algodClient?: any;
}
/**
 * Interface for box storage data.
 * Represents the result of querying box storage from an application.
 */
export interface BoxStorageData {
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
export interface GlobalStorageData {
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
export interface LocalStorageData {
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
export interface TealCodeData {
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
export interface AppQueryResult {
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
export interface AssetParameterData {
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
export interface AssetQueryResult {
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
/**
 * Error class for ARC-82 URI parsing errors.
 * Thrown when a URI cannot be parsed according to the ARC-82 specification.
 */
export declare class Arc82ParseError extends Error {
    uri?: string | undefined;
    /**
     * Creates a new Arc82ParseError.
     * @param message - The error message
     * @param uri - The URI that failed to parse (optional)
     */
    constructor(message: string, uri?: string | undefined);
}
/**
 * Error class for ARC-82 blockchain query errors.
 * Thrown when blockchain queries fail during ARC-82 operations.
 */
export declare class Arc82QueryError extends Error {
    queryType?: string | undefined;
    id?: number | undefined;
    /**
     * Creates a new Arc82QueryError.
     * @param message - The error message
     * @param queryType - The type of query that failed (optional)
     * @param id - The ID that was being queried (optional)
     */
    constructor(message: string, queryType?: string | undefined, id?: number | undefined);
}
/**
 * Main parser class for ARC-82 Algorand URIs.
 * Provides static methods for parsing, constructing, and querying ARC-82 compliant URIs.
 *
 * @example
 * ```typescript
 * // Parse an ARC-82 URI
 * const parsed = Arc82Parser.parse('algorand://app/123?global=Z2xvYmFsX2tleQ%3D%3D');
 *
 * // Build an ARC-82 URI
 * const uri = Arc82Parser.buildAppUri(123, {
 *   global: ['Z2xvYmFsX2tleQ%3D%3D']
 * });
 *
 * // Query blockchain data
 * const result = await Arc82Parser.queryFromUri(uri, 'testnet');
 * ```
 */
export declare class Arc82Parser {
    /** The ARC-82 URI scheme */
    private static readonly SCHEME;
    /** Path prefix for application URIs */
    private static readonly APP_PATH_PREFIX;
    /** Path prefix for asset URIs */
    private static readonly ASSET_PATH_PREFIX;
    /**
     * Parses an ARC-82 compliant URI string.
     *
     * @param uri - The URI string to parse
     * @returns The parsed URI object containing type, ID, and parameters
     * @throws {Arc82ParseError} When the URI is invalid or malformed
     *
     * @example
     * ```typescript
     * const parsed = Arc82Parser.parse('algorand://app/123?box=Ym94X2tleQ%3D%3D');
     * console.log(parsed.type); // AlgorandUriType.APPLICATION
     * console.log(parsed.id); // 123
     * console.log(parsed.appParams?.box); // ['Ym94X2tleQ%3D%3D']
     * ```
     */
    static parse(uri: string): ParsedAlgorandUri;
    /**
     * Parses application-specific query parameters from URL search parameters.
     *
     * @param searchParams - The URLSearchParams object containing query parameters
     * @param uri - The original URI string for error reporting
     * @returns Parsed application query parameters
     * @throws {Arc82ParseError} When parameters are invalid or malformed
     * @private
     */
    private static parseAppParams;
    /**
     * Parses asset-specific query parameters from URL search parameters.
     *
     * @param searchParams - The URLSearchParams object containing query parameters
     * @param uri - The original URI string for error reporting
     * @returns Parsed asset query parameters
     * @private
     */
    private static parseAssetParams;
    /**
     * Validates whether a string is properly base64url encoded.
     *
     * @param str - The string to validate
     * @returns True if the string is valid base64url, false otherwise
     * @private
     */
    private static isValidBase64Url;
    /**
     * Validates whether a string is in valid Algorand address format.
     * Uses simplified validation - a robust implementation would use algosdk.
     *
     * @param address - The address string to validate
     * @returns True if the address format is valid, false otherwise
     * @private
     */
    private static isValidAlgorandAddress;
    /**
     * Constructs an ARC-82 compliant application URI.
     *
     * @param id - The application ID to include in the URI
     * @param params - Optional query parameters for the application
     * @returns A formatted ARC-82 URI string for the application
     * @throws {Arc82ParseError} When the ID is invalid or parameters are malformed
     *
     * @example
     * ```typescript
     * // Simple application URI
     * const uri1 = Arc82Parser.buildAppUri(123);
     * // "algorand://app/123"
     *
     * // Application URI with box query
     * const uri2 = Arc82Parser.buildAppUri(123, {
     *   box: ['Ym94X2tleQ%3D%3D']
     * });
     * // "algorand://app/123?box=Ym94X2tleQ%3D%3D"
     * ```
     */
    static buildAppUri(id: number, params?: AppQueryParams): string;
    /**
     * Constructs an ARC-82 compliant asset URI.
     *
     * @param id - The asset ID to include in the URI
     * @param params - Optional query parameters for the asset
     * @returns A formatted ARC-82 URI string for the asset
     * @throws {Arc82ParseError} When the ID is invalid
     *
     * @example
     * ```typescript
     * // Simple asset URI
     * const uri1 = Arc82Parser.buildAssetUri(456);
     * // "algorand://asset/456"
     *
     * // Asset URI with multiple parameters
     * const uri2 = Arc82Parser.buildAssetUri(456, {
     *   total: true,
     *   decimals: true,
     *   unitname: true
     * });
     * // "algorand://asset/456?total&decimals&unitname"
     * ```
     */
    static buildAssetUri(id: number, params?: AssetQueryParams): string;
    /**
     * Validates whether a URI string is ARC-82 compliant.
     *
     * @param uri - The URI string to validate
     * @returns True if the URI is valid ARC-82 format, false otherwise
     *
     * @example
     * ```typescript
     * const isValid1 = Arc82Parser.isValidArc82Uri('algorand://app/123');
     * // true
     *
     * const isValid2 = Arc82Parser.isValidArc82Uri('http://example.com');
     * // false
     * ```
     */
    static isValidArc82Uri(uri: string): boolean;
    /**
     * Extracts the ID from an ARC-82 URI without performing full parsing.
     *
     * @param uri - The URI string to extract the ID from
     * @returns The extracted ID or null if the URI is invalid
     *
     * @example
     * ```typescript
     * const id1 = Arc82Parser.extractId('algorand://app/123');
     * // 123
     *
     * const id2 = Arc82Parser.extractId('invalid://uri');
     * // null
     * ```
     */
    static extractId(uri: string): number | null;
    /**
     * Extracts the type from an ARC-82 URI without performing full parsing.
     *
     * @param uri - The URI string to extract the type from
     * @returns The extracted type (APPLICATION or ASSET) or null if invalid
     *
     * @example
     * ```typescript
     * const type1 = Arc82Parser.extractType('algorand://app/123');
     * // AlgorandUriType.APPLICATION
     *
     * const type2 = Arc82Parser.extractType('algorand://asset/456');
     * // AlgorandUriType.ASSET
     *
     * const type3 = Arc82Parser.extractType('invalid://uri');
     * // null
     * ```
     */
    static extractType(uri: string): AlgorandUriType | null;
    /**
     * Decodes a base64url encoded string to UTF-8.
     *
     * @param base64url - The base64url encoded string to decode
     * @returns The decoded UTF-8 string
     * @throws {Arc82ParseError} When the input is invalid base64url or decoding fails
     *
     * @example
     * ```typescript
     * const decoded = Arc82Parser.decodeBase64Url('SGVsbG8gV29ybGQ');
     * // "Hello World"
     * ```
     */
    static decodeBase64Url(base64url: string): string;
    /**
     * Encodes a UTF-8 string to base64url format.
     *
     * @param str - The UTF-8 string to encode
     * @returns The base64url encoded string
     *
     * @example
     * ```typescript
     * const encoded = Arc82Parser.encodeBase64Url('Hello World');
     * // "SGVsbG8gV29ybGQ"
     * ```
     */
    static encodeBase64Url(str: string): string;
    /**
     * Queries application data from the Algorand blockchain based on a parsed ARC-82 URI.
     *
     * This method fetches application information and any requested storage data from the blockchain.
     * It supports querying box storage, global state, local state, and TEAL programs.
     *
     * @param parsedUri - The parsed ARC-82 URI for an application
     * @param network - The Algorand network to query (mainnet, testnet, localnet)
     * @returns A promise that resolves to application query results
     * @throws {Arc82QueryError} When the URI is not for an application or querying fails
     *
     * @example
     * ```typescript
     * const uri = 'algorand://app/123?global=Z2xvYmFsX2tleQ%3D%3D&box=Ym94X2tleQ%3D%3D';
     * const parsed = Arc82Parser.parse(uri);
     * const result = await Arc82Parser.queryApplication(parsed, 'testnet');
     *
     * if (result.success) {
     *   console.log('Application exists:', result.exists);
     *   console.log('Global state:', result.global);
     *   console.log('Box storage:', result.boxes);
     * }
     * ```
     */
    static queryApplication(parsedUri: ParsedAlgorandUri, network: Network): Promise<AppQueryResult>;
    /**
     * Queries asset data from the Algorand blockchain based on a parsed ARC-82 URI.
     *
     * This method fetches asset information and any requested parameter data from the blockchain.
     * It supports querying all asset parameters including total supply, decimals, frozen status,
     * names, URLs, and administrative addresses.
     *
     * @param parsedUri - The parsed ARC-82 URI for an asset
     * @param network - The Algorand network to query (mainnet, testnet, localnet)
     * @returns A promise that resolves to asset query results
     * @throws {Arc82QueryError} When the URI is not for an asset or querying fails
     *
     * @example
     * ```typescript
     * const uri = 'algorand://asset/456?total&decimals&unitname';
     * const parsed = Arc82Parser.parse(uri);
     * const result = await Arc82Parser.queryAsset(parsed, 'testnet');
     *
     * if (result.success && result.exists) {
     *   console.log('Total supply:', result.parameters.total);
     *   console.log('Decimals:', result.parameters.decimals);
     *   console.log('Unit name:', result.parameters.unitname);
     * }
     * ```
     */
    static queryAsset(parsedUri: ParsedAlgorandUri, network: Network): Promise<AssetQueryResult>;
    /**
     * Queries blockchain data directly from an ARC-82 URI string.
     *
     * This is a convenience method that combines URI parsing and blockchain querying
     * in a single operation. It automatically determines whether the URI is for an
     * application or asset and calls the appropriate query method.
     *
     * @param uri - The ARC-82 URI string to parse and query
     * @param network - The Algorand network to query (mainnet, testnet, localnet)
     * @returns A promise that resolves to query results (either application or asset data)
     * @throws {Arc82ParseError} When the URI is invalid
     * @throws {Arc82QueryError} When blockchain querying fails
     *
     * @example
     * ```typescript
     * // Query application data
     * const appResult = await Arc82Parser.queryFromUri(
     *   'algorand://app/123?global=Z2xvYmFsX2tleQ%3D%3D',
     *   'testnet'
     * );
     *
     * // Query asset data
     * const assetResult = await Arc82Parser.queryFromUri(
     *   'algorand://asset/456?total&unitname',
     *   'testnet'
     * );
     * ```
     */
    static queryFromUri(uri: string, network: Network): Promise<AppQueryResult | AssetQueryResult>;
}
/**
 * Utility class providing helper functions for working with ARC-82 URIs.
 *
 * This class contains additional validation, example generation, and testing utilities
 * that complement the main Arc82Parser functionality.
 */
export declare class Arc82Utils {
    /**
     * Creates example URIs that demonstrate ARC-82 specification features.
     *
     * These examples are useful for testing, documentation, and demonstrating
     * the various types of queries supported by the ARC-82 standard.
     *
     * @returns A record containing named example URIs for different query types
     *
     * @example
     * ```typescript
     * const examples = Arc82Utils.getExampleUris();
     * console.log(examples.boxQuery);    // Application box storage query
     * console.log(examples.globalQuery); // Application global state query
     * console.log(examples.assetTotal);  // Asset total supply query
     * ```
     */
    static getExampleUris(): Record<string, string>;
    /**
     * Validates whether a URI follows ARC-82 ABNF grammar rules and semantic requirements.
     *
     * This method performs comprehensive validation beyond basic parsing, including
     * checking for proper parameter combinations and semantic constraints defined
     * in the ARC-82 specification.
     *
     * @param uri - The URI string to validate against ARC-82 grammar rules
     * @returns A validation result object containing success status and any error messages
     *
     * @example
     * ```typescript
     * const result1 = Arc82Utils.validateGrammar('algorand://app/123?global=dGVzdA%3D%3D');
     * console.log(result1.valid); // true
     *
     * const result2 = Arc82Utils.validateGrammar('algorand://app/123?local=dGVzdA%3D%3D');
     * console.log(result2.valid); // false
     * console.log(result2.errors); // ['Local storage query requires algorandaddress parameter']
     * ```
     */
    static validateGrammar(uri: string): {
        valid: boolean;
        errors: string[];
    };
}
