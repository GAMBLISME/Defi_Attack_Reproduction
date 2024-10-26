const {ethers, network} = require("hardhat");


const uniswapV3FactoryAddr = '0x1F98431c8aD98523631AE4a59f267346ea31F984';
const nonFungiblePositionManagerAddr = '0xC36442b4a4522E871399CD717aBDD847Ab11FE88';
const swapRouterAddr = '0xE592427A0AEce92De3Edee1F18E0157C05861564';

const erc20Abi = require('../artifacts/contracts/interface.sol/IERC20.json').abi;
const nonFungiblePositionManagerAbi = require('../artifacts/contracts/interface.sol/INonfungiblePositionManager.json').abi;


async function addLiquidity() {
    const Token_Retik_Addr = '0x26EbB8213fb8D66156F1Af8908d43f7e3e367C1d';
    const Token_USDT_Addr = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
    const Retik_USDT_Pool_Addr = '0x1458770554b8918B970444d8b2c02A47F6dF99A7';
    const userAddr = '0x517BB20d3210708364016D6bf3F02A5809fE341E';

    await network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [userAddr],//要冒充的目标账户地址
    });
    const user = await ethers.provider.getSigner(userAddr);

    await network.provider.send("hardhat_setBalance", [
        userAddr,
        ethers.toBeHex(ethers.parseEther('3')),
    ]);


    const Retik = await ethers.getContractAt(erc20Abi, Token_Retik_Addr, user);
    const USDT = await ethers.getContractAt(erc20Abi, Token_USDT_Addr, user);


    console.log('====before addLiquidity====');
    let user_Retik_Balance = ethers.formatEther(await Retik.balanceOf(userAddr));
    let user_USDT_Balance = ethers.formatEther(await USDT.balanceOf(userAddr));
    let pool_Retik_Balance = ethers.formatEther(await Retik.balanceOf(Retik_USDT_Pool_Addr));
    let pool_USDT_Balance = ethers.formatEther(await USDT.balanceOf(Retik_USDT_Pool_Addr));
    console.log('user_Retik_Balance:', user_Retik_Balance);
    console.log('user_USDT_Balance:', user_USDT_Balance);
    console.log('pool_Retik_Balance:', pool_Retik_Balance);
    console.log('pool_USDT_Balance:', pool_USDT_Balance);

    console.log('====start addLiquidity====');
    const maxFeePerGas = (await ethers.provider.getFeeData()).maxFeePerGas;
    const tx = {
        to: nonFungiblePositionManagerAddr,
        gasPrice: maxFeePerGas,
        data: '0x8831645600000000000000000000000026ebb8213fb8d66156f1af8908d43f7e3e367c1d000000000000000000000000dac17f958d2ee523a2206206994597c13d831ec70000000000000000000000000000000000000000000000000000000000000bb8fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffb6518fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffb92900000000000000000000000000000000000000000000000ef080def055352c9690000000000000000000000000000000000000000000000000000000000548da20000000000000000000000000000000000000000000000e46abab379b579237b0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000517bb20d3210708364016d6bf3f02a5809fe341e000000000000000000000000000000000000000000000000000000006672d193',
    }
    const transactionResponse = await user.sendTransaction(tx);
    transactionResponse.wait(1);

    console.log('====after addLiquidity====');
    console.log('user_Retik_Balance:', ethers.formatEther(await Retik.balanceOf(userAddr)));
    console.log('user_USDT_Balance:', ethers.formatEther(await USDT.balanceOf(userAddr)));
    console.log('pool_Retik_Balance:', ethers.formatEther(await Retik.balanceOf(Retik_USDT_Pool_Addr)));
    console.log('pool_USDT_Balance:', ethers.formatEther(await USDT.balanceOf(Retik_USDT_Pool_Addr)));

}

//blockNumber: 20125796
addLiquidity()