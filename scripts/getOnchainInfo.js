const {ethers} = require('hardhat');

BNB_MAINNET_URL = process.env.BNB_MAINNET_URL;
PRIVATE_KEY = process.env.PRIVATE_KEY;

const BNB_Provider = new ethers.JsonRpcProvider(BNB_MAINNET_URL);

const Con30_addr = "0xAb21300fA507Ab30D50c3A5D1Cad617c19E83930";
const Con79_addr = "0x06B912354B167848a4A608a56BC26C680DAD3D79";

async function get30Storage() {
    const slot0 = await BNB_Provider.getStorage(Con30_addr,0);
    const slot1 = await BNB_Provider.getStorage(Con30_addr,1);
    const slot2 = await BNB_Provider.getStorage(Con30_addr,2);
    const slot3 = await BNB_Provider.getStorage(Con30_addr,3);
    const slot4 = await BNB_Provider.getStorage(Con30_addr,4);
    const slot5 = await BNB_Provider.getStorage(Con30_addr,5);

    console.log("slot0: ", slot0);
    console.log("slot1: ", slot1);
    console.log("slot2: ", slot2);
    console.log("slot3: ", slot3);
    console.log("slot4: ", slot4);
    console.log("slot5: ", slot5);
}


async function get79Storage() {
    const slot0 = await BNB_Provider.getStorage(Con79_addr,0);
    const slot1 = await BNB_Provider.getStorage(Con79_addr,1);
    const slot2 = await BNB_Provider.getStorage(Con79_addr,2);
    const slot3 = await BNB_Provider.getStorage(Con79_addr,3);
    const slot4 = await BNB_Provider.getStorage(Con79_addr,4);
    const slot5 = await BNB_Provider.getStorage(Con79_addr,5);
    const slot6 = await BNB_Provider.getStorage(Con79_addr,6);
    const slot7 = await BNB_Provider.getStorage(Con79_addr,7);
    const slot8 = await BNB_Provider.getStorage(Con79_addr,8);

    console.log("slot0: ", slot0);
    console.log("slot1: ", slot1);
    console.log("slot2: ", slot2);
    console.log("slot3: ", slot3);
    console.log("slot4: ", slot4);
    console.log("slot5: ", slot5);
    console.log("slot6: ", slot6);
    console.log("slot7: ", slot7);
    console.log("slot8: ", slot8);
}

get79Storage()