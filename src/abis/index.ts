import algosdk from 'algosdk';

import arc59ContractAbi from './arc59.json';
import arc54ContractAbi from './arc54.json';

const arc59Abi = new algosdk.ABIContract(arc59ContractAbi);
const arc54Abi = new algosdk.ABIContract(arc54ContractAbi);
export { arc59Abi, arc54Abi };
