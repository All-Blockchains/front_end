const axios = require('axios');
const solc = require('solc');
const fs = require('fs');

const TronWeb = require('tronweb');
const config = require('../config/tron.json');

const CONTRACT_FOLDER = 'contracts/';

// const myUrl = new HttpProvider('https://api.shasta.trongrid.io');
const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = new HttpProvider('https://api.shasta.trongrid.io');
const solidityNode = new HttpProvider('https://api.shasta.trongrid.io');
const eventServer = 'https://api.shasta.trongrid.io/';

const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, config.deploy_keys.testnet);


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getData(hash) {

    try {

        console.log(hash);
        return await axios.get('https://api.shasta.trongrid.io/wallet/gettransactioninfobyid?value=' + hash);

    } catch (e) {

        console.error(e);

    }

}


async function deploy() {

    const input = {};

    const files = fs.readdirSync(CONTRACT_FOLDER);

    files.map((file) => {
        input[file] = fs.readFileSync(CONTRACT_FOLDER + file, 'utf8').toString();
    });

    const output = {};

    console.log(`Compiling solidity...`);

    const compiled = solc.compile({sources: input}, 1);

    if (!compiled.errors) {

        for (let contractName in compiled.contracts) {
            console.log(compiled.contracts);
            // code and ABI that are needed by web3
            console.log(`deploying ${contractName}`);

            const unsigned = await tronWeb.transactionBuilder.createSmartContract({
                abi: compiled.contracts[contractName].interface,
                bytecode: compiled.contracts[contractName].bytecode,
            });
            const signed = await tronWeb.trx.sign(unsigned);

            const broadcastResult = await tronWeb.trx.sendRawTransaction(signed);

            if (broadcastResult.result === true) {

                console.log(" broadcastResult : ", broadcastResult);

                console.log("txID : ", signed.txID);

                console.log("before sleep");
                await sleep(5000);
                console.log("after sleep ");

                let {data} = await getData(signed.txID);


                console.log(data);

                do {
                    if (data.id && data.receipt.result === 'SUCCESS') {
                        if (data.receipt.result) {
                            console.log(`SUCCESSFULLY deployed ${contractName}. Cost: ${data.receipt.energy_fee / 1000000} TRX.`);
                            console.log(`Contract address: ${signed.contract_address}`);
                            output[contractName] = signed.contract_address;
                            output[contractName] = {
                                address: signed.contract_address,
                                abi: JSON.parse(compiled.contracts[contractName].interface)
                            }
                        } else {
                            console.log(`FAILED deploying ${contractName}. Cost: ${data.receipt.energy_fee / 1000000} TRX.`);
                            console.log(`transaction info:`);
                            console.log("error");
                            process.exit();
                        }
                    }
                    await sleep(2000);
                } while (!data.id);
            } else {
                console.log(`FAILED to broadcast ${contractName} deploy transaction`);
                console.log((broadcastResult));
                process.exit();
            }
        }

        fs.writeFileSync('src/config/contracts.json', JSON.stringify(output, null, 4));
    } else {
        console.log(`FAILED to compile solidity...`);
        compiled.errors.map((e) => {
            console.log(e);
        });
    }
}

deploy();
