export const MAIN_TRON_API = "https://api.trongrid.io";

export const MAIN_FOUNDATION_ADDRESS = 'TBxZSq8sVYzHq4xVpfRodda3fEgpJMCJgG';

export const MAIN_CONTRACT_ADDRESS = 'TKvNjUuaLDpGkuNpiTAQpB4YpWfcvabPwm';
//THPgisMAwFuqfW7tFCVQrm81X6ktVM1whi
export const DONT_ADDRESS = 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb';


export const MAIN_ABI = [{
    "constant": true,
    "inputs": [],
    "name": "getBalance",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "_feeToRegister", "type": "uint256"}],
    "name": "updateFeeToRegister",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "name", "type": "string"}, {"name": "myaddress", "type": "address"}],
    "name": "addWallet",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [],
    "name": "withdraw",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "_owner", "type": "address"}],
    "name": "changeOwner",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "name", "type": "string"}],
    "name": "add",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "_balance", "type": "uint256"}],
    "name": "updateBalance",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{"name": "name", "type": "string"}],
    "name": "getAddress",
    "outputs": [{"name": "", "type": "address"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "getSize",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [],
    "name": "mySelfDestruct",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {"inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor"}, {
    "payable": true,
    "stateMutability": "payable",
    "type": "fallback"
}];