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
import { AlgorandUriType, AppQueryParams, AppQueryResult, AssetQueryParams, AssetQueryResult, ParsedAlgorandUri } from './types';
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
 * const parsed = Arc82.parse('algorand://app/123?global=Z2xvYmFsX2tleQ%3D%3D');
 *
 * // Build an ARC-82 URI
 * const uri = Arc82.buildAppUri(123, {
 *   global: ['Z2xvYmFsX2tleQ%3D%3D']
 * });
 *
 * // Query blockchain data
 * const result = await Arc82.queryFromUri(uri, 'testnet');
 * ```
 */
export declare class Arc82 {
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
     * const parsed = Arc82.parse('algorand://app/123?box=Ym94X2tleQ%3D%3D');
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
     * const uri1 = Arc82.buildAppUri(123);
     * // "algorand://app/123"
     *
     * // Application URI with box query
     * const uri2 = Arc82.buildAppUri(123, {
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
     * const uri1 = Arc82.buildAssetUri(456);
     * // "algorand://asset/456"
     *
     * // Asset URI with multiple parameters
     * const uri2 = Arc82.buildAssetUri(456, {
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
     * const isValid1 = Arc82.isValidArc82Uri('algorand://app/123');
     * // true
     *
     * const isValid2 = Arc82.isValidArc82Uri('http://example.com');
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
     * const id1 = Arc82.extractId('algorand://app/123');
     * // 123
     *
     * const id2 = Arc82.extractId('invalid://uri');
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
     * const type1 = Arc82.extractType('algorand://app/123');
     * // AlgorandUriType.APPLICATION
     *
     * const type2 = Arc82.extractType('algorand://asset/456');
     * // AlgorandUriType.ASSET
     *
     * const type3 = Arc82.extractType('invalid://uri');
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
     * const decoded = Arc82.decodeBase64Url('SGVsbG8gV29ybGQ');
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
     * const encoded = Arc82.encodeBase64Url('Hello World');
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
     * const parsed = Arc82.parse(uri);
     * const result = await Arc82.queryApplication(parsed, 'testnet');
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
     * const parsed = Arc82.parse(uri);
     * const result = await Arc82.queryAsset(parsed, 'testnet');
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
     * const appResult = await Arc82.queryFromUri(
     *   'algorand://app/123?global=Z2xvYmFsX2tleQ%3D%3D',
     *   'testnet'
     * );
     *
     * // Query asset data
     * const assetResult = await Arc82.queryFromUri(
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
 * that complement the main Arc82 functionality.
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
