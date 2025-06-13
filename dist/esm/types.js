/**
 * Common type definitions used throughout the library
 * @module types
 */
/**
 * Types of Algorand URI schemes supported by ARC-82.
 * Defines the supported resource types that can be queried via ARC-82 URIs.
 */
var AlgorandUriType;
(function (AlgorandUriType) {
    /** Application resource type (algorand://app/{id}) */
    AlgorandUriType["APPLICATION"] = "app";
    /** Asset resource type (algorand://asset/{id}) */
    AlgorandUriType["ASSET"] = "asset";
})(AlgorandUriType || (AlgorandUriType = {}));
/**
 * Application storage types supported in ARC-82.
 * Defines the different types of storage that can be queried for applications.
 */
var AppStorageType;
(function (AppStorageType) {
    /** Box storage - key-value pairs stored in application boxes */
    AppStorageType["BOX"] = "box";
    /** Global storage - global state variables of the application */
    AppStorageType["GLOBAL"] = "global";
    /** Local storage - account-specific state variables */
    AppStorageType["LOCAL"] = "local";
    /** TEAL code - the application's approval and clear state programs */
    AppStorageType["TEALCODE"] = "tealcode";
})(AppStorageType || (AppStorageType = {}));
/**
 * Asset parameter types supported in ARC-82.
 * Defines the asset parameters that can be queried from the blockchain.
 */
var AssetParamType;
(function (AssetParamType) {
    /** Total supply of the asset */
    AssetParamType["TOTAL"] = "total";
    /** Number of decimal places for the asset */
    AssetParamType["DECIMALS"] = "decimals";
    /** Default frozen status for new asset holdings */
    AssetParamType["FROZEN"] = "frozen";
    /** Unit name/symbol of the asset */
    AssetParamType["UNITNAME"] = "unitname";
    /** Full name of the asset */
    AssetParamType["ASSETNAME"] = "assetname";
    /** URL associated with the asset */
    AssetParamType["URL"] = "url";
    /** Metadata hash of the asset */
    AssetParamType["METADATAHASH"] = "metadatahash";
    /** Manager address of the asset */
    AssetParamType["MANAGER"] = "manager";
    /** Reserve address of the asset */
    AssetParamType["RESERVE"] = "reserve";
    /** Freeze address of the asset */
    AssetParamType["FREEZE"] = "freeze";
    /** Clawback address of the asset */
    AssetParamType["CLAWBACK"] = "clawback";
})(AssetParamType || (AssetParamType = {}));
export { AlgorandUriType, AppStorageType, AssetParamType, };
//# sourceMappingURL=types.js.map