"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.arc54Abi = exports.arc59Abi = void 0;
const algosdk_1 = __importDefault(require("algosdk"));
const arc59_json_1 = __importDefault(require("./arc59.json"));
const arc54_json_1 = __importDefault(require("./arc54.json"));
const arc59Abi = new algosdk_1.default.ABIContract(arc59_json_1.default);
exports.arc59Abi = arc59Abi;
const arc54Abi = new algosdk_1.default.ABIContract(arc54_json_1.default);
exports.arc54Abi = arc54Abi;
//# sourceMappingURL=index.js.map