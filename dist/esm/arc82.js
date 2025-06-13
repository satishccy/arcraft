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
import { base64ToBuffer, getAlgodClient, uint8ArrayToBase64, UniversalBuffer, } from './utils';
import { AlgorandUriType, AssetParamType, } from './types';
/**
 * Error class for ARC-82 URI parsing errors.
 * Thrown when a URI cannot be parsed according to the ARC-82 specification.
 */
export class Arc82ParseError extends Error {
    /**
     * Creates a new Arc82ParseError.
     * @param message - The error message
     * @param uri - The URI that failed to parse (optional)
     */
    constructor(message, uri) {
        super(message);
        this.uri = uri;
        this.name = 'Arc82ParseError';
    }
}
/**
 * Error class for ARC-82 blockchain query errors.
 * Thrown when blockchain queries fail during ARC-82 operations.
 */
export class Arc82QueryError extends Error {
    /**
     * Creates a new Arc82QueryError.
     * @param message - The error message
     * @param queryType - The type of query that failed (optional)
     * @param id - The ID that was being queried (optional)
     */
    constructor(message, queryType, id) {
        super(message);
        this.queryType = queryType;
        this.id = id;
        this.name = 'Arc82QueryError';
    }
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
export class Arc82 {
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
    static parse(uri) {
        if (!uri || typeof uri !== 'string') {
            throw new Arc82ParseError('URI must be a non-empty string', uri);
        }
        // Validate scheme
        if (!uri.startsWith(`${this.SCHEME}:`)) {
            throw new Arc82ParseError(`URI must start with '${this.SCHEME}:'`, uri);
        }
        const url = new URL(uri);
        if (url.protocol !== `${this.SCHEME}:`) {
            throw new Arc82ParseError(`Invalid scheme. Expected '${this.SCHEME}:'`, uri);
        }
        // Determine type and extract ID
        let type;
        let id;
        if (uri.includes(this.APP_PATH_PREFIX)) {
            type = AlgorandUriType.APPLICATION;
            const appMatch = uri.match(/algorand:\/\/app\/(\d+)/);
            if (!appMatch) {
                throw new Arc82ParseError('Invalid application URI format', uri);
            }
            id = parseInt(appMatch[1], 10);
        }
        else if (uri.includes(this.ASSET_PATH_PREFIX)) {
            type = AlgorandUriType.ASSET;
            const assetMatch = uri.match(/algorand:\/\/asset\/(\d+)/);
            if (!assetMatch) {
                throw new Arc82ParseError('Invalid asset URI format', uri);
            }
            id = parseInt(assetMatch[1], 10);
        }
        else {
            throw new Arc82ParseError('URI must contain either //app/ or //asset/ path', uri);
        }
        if (isNaN(id) || id < 0) {
            throw new Arc82ParseError('Invalid ID: must be a non-negative integer', uri);
        }
        // Parse query parameters
        const searchParams = url.searchParams;
        const result = {
            type,
            id,
            originalUri: uri,
        };
        if (type === AlgorandUriType.APPLICATION) {
            result.appParams = this.parseAppParams(searchParams, uri);
        }
        else {
            result.assetParams = this.parseAssetParams(searchParams, uri);
        }
        return result;
    }
    /**
     * Parses application-specific query parameters from URL search parameters.
     *
     * @param searchParams - The URLSearchParams object containing query parameters
     * @param uri - The original URI string for error reporting
     * @returns Parsed application query parameters
     * @throws {Arc82ParseError} When parameters are invalid or malformed
     * @private
     */
    static parseAppParams(searchParams, uri) {
        const params = {};
        // Parse box parameters
        const boxParams = searchParams.getAll('box');
        if (boxParams.length > 0) {
            params.box = boxParams.filter((param) => this.isValidBase64Url(param));
            if (params.box.length !== boxParams.length) {
                throw new Arc82ParseError('Invalid base64url encoding in box parameter', uri);
            }
        }
        // Parse global parameters
        const globalParams = searchParams.getAll('global');
        if (globalParams.length > 0) {
            params.global = globalParams.filter((param) => this.isValidBase64Url(param));
            if (params.global.length !== globalParams.length) {
                throw new Arc82ParseError('Invalid base64url encoding in global parameter', uri);
            }
        }
        // Parse local parameters (requires algorandaddress)
        const localParams = searchParams.getAll('local');
        if (localParams.length > 0) {
            params.local = [];
            for (const localParam of localParams) {
                if (!this.isValidBase64Url(localParam)) {
                    throw new Arc82ParseError('Invalid base64url encoding in local parameter', uri);
                }
                // Local parameters require algorandaddress
                const addresses = searchParams.getAll('algorandaddress');
                if (addresses.length === 0) {
                    throw new Arc82ParseError('Local storage queries require algorandaddress parameter', uri);
                }
                // For simplicity, pair each local key with the first address
                // In a more sophisticated implementation, you might want to handle multiple addresses
                const address = addresses[0];
                if (!this.isValidAlgorandAddress(address)) {
                    throw new Arc82ParseError('Invalid Algorand address format', uri);
                }
                params.local.push({
                    key: localParam,
                    algorandaddress: address,
                });
            }
        }
        // Check for tealcode parameter
        if (searchParams.has('tealcode')) {
            params.tealcode = true;
        }
        return params;
    }
    /**
     * Parses asset-specific query parameters from URL search parameters.
     *
     * @param searchParams - The URLSearchParams object containing query parameters
     * @param uri - The original URI string for error reporting
     * @returns Parsed asset query parameters
     * @private
     */
    static parseAssetParams(searchParams, uri) {
        const params = {};
        // Check for each asset parameter type
        for (const paramType of Object.values(AssetParamType)) {
            if (searchParams.has(paramType)) {
                params[paramType] = true;
            }
        }
        return params;
    }
    /**
     * Validates whether a string is properly base64url encoded.
     *
     * @param str - The string to validate
     * @returns True if the string is valid base64url, false otherwise
     * @private
     */
    static isValidBase64Url(str) {
        if (!str)
            return false;
        // Base64url uses A-Z, a-z, 0-9, -, _
        const base64UrlRegex = /^[A-Za-z0-9\-_]*$/;
        return base64UrlRegex.test(str);
    }
    /**
     * Validates whether a string is in valid Algorand address format.
     * Uses simplified validation - a robust implementation would use algosdk.
     *
     * @param address - The address string to validate
     * @returns True if the address format is valid, false otherwise
     * @private
     */
    static isValidAlgorandAddress(address) {
        if (!address)
            return false;
        // Algorand addresses are 58 characters long and use base32 encoding
        // This is a simplified check - a more robust implementation would use algosdk
        const base32Regex = /^[A-Z2-7]{58}$/;
        return base32Regex.test(address);
    }
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
    static buildAppUri(id, params) {
        if (id < 0 || !Number.isInteger(id)) {
            throw new Arc82ParseError('Application ID must be a non-negative integer');
        }
        let uri = `${this.SCHEME}://app/${id}`;
        const queryParams = new URLSearchParams();
        if (params) {
            // Add box parameters
            if (params.box) {
                for (const boxKey of params.box) {
                    if (!this.isValidBase64Url(boxKey)) {
                        throw new Arc82ParseError('Box keys must be valid base64url encoded');
                    }
                    queryParams.append('box', boxKey);
                }
            }
            // Add global parameters
            if (params.global) {
                for (const globalKey of params.global) {
                    if (!this.isValidBase64Url(globalKey)) {
                        throw new Arc82ParseError('Global keys must be valid base64url encoded');
                    }
                    queryParams.append('global', globalKey);
                }
            }
            // Add local parameters
            if (params.local) {
                for (const localParam of params.local) {
                    if (!this.isValidBase64Url(localParam.key)) {
                        throw new Arc82ParseError('Local keys must be valid base64url encoded');
                    }
                    if (!this.isValidAlgorandAddress(localParam.algorandaddress)) {
                        throw new Arc82ParseError('Invalid Algorand address format');
                    }
                    queryParams.append('local', localParam.key);
                    queryParams.append('algorandaddress', localParam.algorandaddress);
                }
            }
            // Add tealcode parameter
            if (params.tealcode) {
                queryParams.append('tealcode', '');
            }
        }
        const queryString = queryParams.toString();
        return queryString ? `${uri}?${queryString}` : uri;
    }
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
    static buildAssetUri(id, params) {
        if (id < 0 || !Number.isInteger(id)) {
            throw new Arc82ParseError('Asset ID must be a non-negative integer');
        }
        let uri = `${this.SCHEME}://asset/${id}`;
        const queryParams = new URLSearchParams();
        if (params) {
            // Add asset parameters
            for (const [key, value] of Object.entries(params)) {
                if (value === true &&
                    Object.values(AssetParamType).includes(key)) {
                    queryParams.append(key, '');
                }
            }
        }
        const queryString = queryParams.toString();
        return queryString ? `${uri}?${queryString}` : uri;
    }
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
    static isValidArc82Uri(uri) {
        try {
            this.parse(uri);
            return true;
        }
        catch {
            return false;
        }
    }
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
    static extractId(uri) {
        try {
            const parsed = this.parse(uri);
            return parsed.id;
        }
        catch {
            return null;
        }
    }
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
    static extractType(uri) {
        try {
            const parsed = this.parse(uri);
            return parsed.type;
        }
        catch {
            return null;
        }
    }
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
    static decodeBase64Url(base64url) {
        if (!this.isValidBase64Url(base64url)) {
            throw new Arc82ParseError('Invalid base64url encoding');
        }
        // Add proper padding if needed
        let padded = base64url;
        while (padded.length % 4) {
            padded += '=';
        }
        // Convert base64url to base64
        const base64 = padded.replace(/-/g, '+').replace(/_/g, '/');
        try {
            return UniversalBuffer.from(base64, 'base64').toString('utf-8');
        }
        catch (error) {
            throw new Arc82ParseError('Failed to decode base64url string');
        }
    }
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
    static encodeBase64Url(str) {
        const base64 = UniversalBuffer.from(str, 'utf-8').toString('base64');
        return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    }
    // ==================== BLOCKCHAIN QUERY METHODS ====================
    // TODO: Implement actual blockchain querying logic using algosdk
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
    static async queryApplication(parsedUri, network) {
        if (parsedUri.type !== AlgorandUriType.APPLICATION) {
            throw new Arc82QueryError('URI must be for an application', 'application', parsedUri.id);
        }
        // TODO: Replace with actual blockchain querying logic
        const algod = getAlgodClient(network);
        let appInfo;
        try {
            appInfo = await algod.getApplicationByID(parsedUri.id).do();
        }
        catch (error) {
            return {
                appId: parsedUri.id,
                exists: false,
                success: false,
                error: error instanceof Error ? error.message : 'Application not found',
            };
        }
        const result = {
            appId: parsedUri.id,
            exists: true,
            success: true,
            error: undefined,
        };
        try {
            if (parsedUri.appParams) {
                if (parsedUri.appParams.box) {
                    result.boxes = [];
                    for (const boxKey of parsedUri.appParams.box) {
                        const boxData = {
                            key: boxKey,
                            decodedKey: this.decodeBase64Url(boxKey),
                            value: null,
                            exists: false,
                            error: undefined,
                        };
                        try {
                            const boxKeyBuffer = base64ToBuffer(this.decodeBase64Url(boxKey));
                            const boxResponse = await algod
                                .getApplicationBoxByName(parsedUri.id, boxKeyBuffer)
                                .do();
                            boxData.value = uint8ArrayToBase64(boxResponse.value);
                            boxData.exists = true;
                        }
                        catch (error) {
                            boxData.error =
                                error instanceof Error
                                    ? error.message
                                    : 'Failed to query box storage';
                        }
                        result.boxes.push(boxData);
                    }
                }
                if (parsedUri.appParams.global) {
                    result.global = [];
                    const globalState = appInfo.params.globalState || [];
                    for (const globalKey of parsedUri.appParams.global) {
                        const availableGlobalState = globalState.find((state) => this.encodeBase64Url(uint8ArrayToBase64(state.key)) ===
                            globalKey);
                        if (availableGlobalState) {
                            result.global.push({
                                key: globalKey,
                                decodedKey: this.decodeBase64Url(globalKey),
                                value: availableGlobalState.value.type === 1
                                    ? availableGlobalState.value.bytes
                                    : availableGlobalState.value.uint,
                                valueType: availableGlobalState.value.type === 1 ? 'bytes' : 'uint',
                                decodedValue: availableGlobalState.value.type === 1
                                    ? new TextDecoder().decode(availableGlobalState.value.bytes)
                                    : undefined,
                                exists: true,
                                error: undefined,
                            });
                        }
                        else {
                            result.global.push({
                                key: globalKey,
                                decodedKey: this.decodeBase64Url(globalKey),
                                value: null,
                                valueType: null,
                                exists: false,
                                error: 'Global state not found',
                            });
                        }
                    }
                }
                if (parsedUri.appParams.local) {
                    result.local = [];
                    for (const localParam of parsedUri.appParams.local) {
                        const accountInfo = await algod
                            .accountInformation(localParam.algorandaddress)
                            .do();
                        const accountLocalState = accountInfo.appsLocalState || [];
                        const appsLocalState = accountLocalState.filter((state) => state.id === BigInt(parsedUri.id));
                        const appLocalState = appsLocalState.length > 0 ? appsLocalState[0] : undefined;
                        let localState;
                        if (appLocalState && appLocalState.keyValue) {
                            const availableLocalState = appLocalState.keyValue.find((state) => this.encodeBase64Url(uint8ArrayToBase64(state.key)) ===
                                localParam.key);
                            if (availableLocalState) {
                                localState = {
                                    key: localParam.key,
                                    decodedKey: this.decodeBase64Url(localParam.key),
                                    address: localParam.algorandaddress,
                                    value: availableLocalState.value.type === 1
                                        ? availableLocalState.value.bytes
                                        : availableLocalState.value.uint,
                                    valueType: availableLocalState.value.type === 1 ? 'bytes' : 'uint',
                                    decodedValue: availableLocalState.value.type === 1
                                        ? new TextDecoder().decode(availableLocalState.value.bytes)
                                        : undefined,
                                    exists: true,
                                    isOptedIn: true,
                                    error: undefined,
                                };
                            }
                        }
                        if (localState) {
                            result.local.push(localState);
                        }
                        else {
                            result.local.push({
                                key: localParam.key,
                                decodedKey: this.decodeBase64Url(localParam.key),
                                address: localParam.algorandaddress,
                                value: null,
                                valueType: null,
                                exists: false,
                                isOptedIn: false,
                                error: 'Local state not found',
                            });
                        }
                    }
                }
                if (parsedUri.appParams.tealcode) {
                    result.tealCode = {
                        approvalProgramB64: uint8ArrayToBase64(appInfo.params.approvalProgram || new Uint8Array()),
                        clearStateProgramB64: uint8ArrayToBase64(appInfo.params.clearStateProgram || new Uint8Array()),
                        error: undefined,
                    };
                }
            }
        }
        catch (error) {
            result.success = false;
            result.error =
                error instanceof Error ? error.message : 'Unknown error occurred';
        }
        return result;
    }
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
    static async queryAsset(parsedUri, network) {
        if (parsedUri.type !== AlgorandUriType.ASSET) {
            throw new Arc82QueryError('URI must be for an asset', 'asset', parsedUri.id);
        }
        const algod = getAlgodClient(network);
        let assetInfo;
        try {
            assetInfo = await algod.getAssetByID(parsedUri.id).do();
        }
        catch (error) {
            return {
                assetId: parsedUri.id,
                parameters: {},
                exists: false,
                success: false,
                error: error instanceof Error ? error.message : 'Asset not found',
            };
        }
        const result = {
            assetId: parsedUri.id,
            parameters: {},
            exists: true,
            success: true,
            error: undefined,
        };
        try {
            if (parsedUri.assetParams && result.exists) {
                const params = result.parameters;
                if (parsedUri.assetParams.total) {
                    params.total = Number(assetInfo.params.total);
                }
                if (parsedUri.assetParams.decimals) {
                    params.decimals = Number(assetInfo.params.decimals);
                }
                if (parsedUri.assetParams.frozen) {
                    params.frozen = assetInfo.params.defaultFrozen;
                }
                if (parsedUri.assetParams.unitname) {
                    params.unitname = assetInfo.params.unitName;
                }
                if (parsedUri.assetParams.assetname) {
                    params.assetname = assetInfo.params.name;
                }
                if (parsedUri.assetParams.url) {
                    params.url = assetInfo.params.url;
                }
                if (parsedUri.assetParams.metadatahash) {
                    params.metadatahash = assetInfo.params.metadataHash
                        ? uint8ArrayToBase64(assetInfo.params.metadataHash)
                        : undefined;
                }
                if (parsedUri.assetParams.manager) {
                    params.manager = assetInfo.params.manager;
                }
                if (parsedUri.assetParams.reserve) {
                    params.reserve = assetInfo.params.reserve;
                }
                if (parsedUri.assetParams.freeze) {
                    params.freeze = assetInfo.params.freeze;
                }
                if (parsedUri.assetParams.clawback) {
                    params.clawback = assetInfo.params.clawback;
                }
            }
        }
        catch (error) {
            result.success = false;
            result.error =
                error instanceof Error ? error.message : 'Unknown error occurred';
        }
        return result;
    }
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
    static async queryFromUri(uri, network) {
        const parsed = this.parse(uri);
        if (parsed.type === AlgorandUriType.APPLICATION) {
            return this.queryApplication(parsed, network);
        }
        else {
            return this.queryAsset(parsed, network);
        }
    }
}
/** The ARC-82 URI scheme */
Arc82.SCHEME = 'algorand';
/** Path prefix for application URIs */
Arc82.APP_PATH_PREFIX = '//app/';
/** Path prefix for asset URIs */
Arc82.ASSET_PATH_PREFIX = '//asset/';
/**
 * Utility class providing helper functions for working with ARC-82 URIs.
 *
 * This class contains additional validation, example generation, and testing utilities
 * that complement the main Arc82 functionality.
 */
export class Arc82Utils {
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
    static getExampleUris() {
        return {
            // Application examples
            boxQuery: 'algorand://app/2345?box=YWxnb3JvbmQ%3D',
            globalQuery: 'algorand://app/12345?global=Z2xvYmFsX2tleQ%3D%3D',
            localQuery: 'algorand://app/12345?local=bG9jYWxfa2V5&algorandaddress=ABCDEFGHIJKLMNOPQRSTUVWXYZ234567',
            // Asset examples
            assetTotal: 'algorand://asset/67890?total',
            assetDecimals: 'algorand://asset/67890?decimals',
            assetMultiple: 'algorand://asset/67890?total&decimals&unitname',
        };
    }
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
    static validateGrammar(uri) {
        const errors = [];
        try {
            const parsed = Arc82.parse(uri);
            // Additional grammar validation beyond basic parsing
            if (parsed.type === AlgorandUriType.APPLICATION && parsed.appParams) {
                // Validate local storage requires algorandaddress
                if (parsed.appParams.local && parsed.appParams.local.length > 0) {
                    for (const localParam of parsed.appParams.local) {
                        if (!localParam.algorandaddress) {
                            errors.push('Local storage query requires algorandaddress parameter');
                        }
                    }
                }
            }
            return { valid: errors.length === 0, errors };
        }
        catch (error) {
            if (error instanceof Arc82ParseError) {
                errors.push(error.message);
            }
            else {
                errors.push('Unknown parsing error');
            }
            return { valid: false, errors };
        }
    }
}
//# sourceMappingURL=arc82.js.map