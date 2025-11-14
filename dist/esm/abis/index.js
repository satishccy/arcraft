import algosdk from 'algosdk';
import arc59ContractAbi from './arc59.json';
import arc54ContractAbi from './arc54.json';
import arc62ContractAbi from './arc62.json';
const arc59Abi = new algosdk.ABIContract(arc59ContractAbi);
const arc54Abi = new algosdk.ABIContract(arc54ContractAbi);
const arc62Abi = new algosdk.ABIContract(arc62ContractAbi);
export { arc59Abi, arc54Abi, arc62Abi };
//# sourceMappingURL=index.js.map