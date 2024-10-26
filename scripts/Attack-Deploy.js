const {ethers} = require('hardhat');

const deployContract = async (contractName, args = []) => {
    const users = await ethers.getSigners();
    console.log('Deploying contract with the account:', users[0].address);

    const ContractFactory = await ethers.getContractFactory(contractName);
    const deployedContract = await ContractFactory.connect(users[0]).deploy(...args, {gasPrice: (await ethers.provider.getFeeData()).maxFeePerGas});
    await deployedContract.waitForDeployment();
    const address = await deployedContract.getAddress();
    console.log(`${contractName} deployed to:`, address);
    return deployedContract;
}

module.exports = {deployContract};
