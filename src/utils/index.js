//import contracts from '../config/contracts';

const axios = require('axios');
const {CONTRACT_ADDRESS, ABI, MAIN_ABI, MAIN_CONTRACT_ADDRESS} = require('../utils/constants');
//const contract = contracts['main4.sol:main'];

const utils = {

    tronWeb: false,
    contract: false,

    async setTronWeb(tronWeb) {

        this.tronWeb = tronWeb;


        this.contract = this.tronWeb.contract(MAIN_ABI, MAIN_CONTRACT_ADDRESS);
    },


    async getData(hash) {

        try {

            // return await axios.get('https://api.shasta.trongrid.io/wallet/gettransactioninfobyid?value=' + hash);
            return await axios.get('https://api.trongrid.io/wallet/gettransactioninfobyid?value=' + await hash);


        } catch (e) {

            console.error(e);

        }

    },

    async fetchAddress(name) {

        const newContract = await this.tronWeb.contract(
            MAIN_ABI, MAIN_CONTRACT_ADDRESS);

        console.log("befor calling getwallet ");
        const x = await newContract.getAddress(name).call();
        const address = this.tronWeb.address.fromHex(x);
        console.log("address in fetchAddress : ", address);
        return address;
    },


};

export default utils;