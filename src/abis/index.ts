import algosdk from 'algosdk';

import contractAbi from './arc59.json';

const arc59Abi = new algosdk.ABIContract(contractAbi);

export { arc59Abi };
