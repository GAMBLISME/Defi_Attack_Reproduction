const {ethers, network} = require("hardhat");


const uniswapV3FactoryAddr = '0x1F98431c8aD98523631AE4a59f267346ea31F984';
const nonFungiblePositionManagerAddr = '0xC36442b4a4522E871399CD717aBDD847Ab11FE88';
const swapRouterAddr = '0xE592427A0AEce92De3Edee1F18E0157C05861564';

const erc20Abi = require('../artifacts/contracts/interface.sol/IERC20.json').abi;
const nonFungiblePositionManagerAbi = require('../artifacts/contracts/interface.sol/INonfungiblePositionManager.json').abi;


async function swap() {
    const Token_RCH_Addr = '0x57B96D4aF698605563A4653D882635da59Bf11AF';
    const Token_WETH_Addr = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
    const RCH_WETH_Pool_Addr = '0xc39e83fe4e412a885c0577c08eb53bdb6548004a';
    const userAddr = '0xE883D70baeaa6322D3b89021bF67E7B59112276C';

    await network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [userAddr],//要冒充的目标账户地址
    });
    const user = await ethers.provider.getSigner(userAddr);

    const RCH = await ethers.getContractAt(erc20Abi, Token_RCH_Addr, user);
    const WETH = await ethers.getContractAt(erc20Abi, Token_WETH_Addr, user);


    console.log('====before swap====');
    let user_RCH_Balance = ethers.formatEther(await RCH.balanceOf(userAddr));
    let user_ETH_Balance = ethers.formatEther(await network.provider.send('eth_getBalance', [userAddr]));
    let pool_RCH_Balance = ethers.formatEther(await RCH.balanceOf(RCH_WETH_Pool_Addr));
    let pool_WETH_Balance = ethers.formatEther(await WETH.balanceOf(RCH_WETH_Pool_Addr));
    console.log('user_RCH_Balance:', user_RCH_Balance);
    console.log('user_ETH_Balance:', user_ETH_Balance);
    console.log('pool_RCH_Balance:', pool_RCH_Balance);
    console.log('pool_WETH_Balance:', pool_WETH_Balance);


    console.log('====start swap====');
    const maxFeePerGas = (await ethers.provider.getFeeData()).maxFeePerGas;
    const tx = {
        to: swapRouterAddr,
        gasPrice: maxFeePerGas,
        value: ethers.parseEther('3'),
        data: '0x414bf389000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc200000000000000000000000057b96d4af698605563a4653d882635da59bf11af00000000000000000000000000000000000000000000000000000000000001f4000000000000000000000000e883d70baeaa6322d3b89021bf67e7b59112276c00000000000000000000000000000000000000000000000000000000667196ff00000000000000000000000000000000000000000000000029a2241af62c00000000000000000000000000000000000000000000000001de3be3aba573b9ca230000000000000000000000000000000000000000000000000000000000000000',
    }
    const transactionResponse = await user.sendTransaction(tx);
    transactionResponse.wait(1);

    console.log('====after swap====');
    user_RCH_Balance = ethers.formatEther(await RCH.balanceOf(userAddr));
    user_ETH_Balance = ethers.formatEther(await network.provider.send('eth_getBalance', [userAddr]));
    pool_RCH_Balance = ethers.formatEther(await RCH.balanceOf(RCH_WETH_Pool_Addr));
    pool_WETH_Balance = ethers.formatEther(await WETH.balanceOf(RCH_WETH_Pool_Addr));
    console.log('user_RCH_Balance:', user_RCH_Balance);
    console.log('user_ETH_Balance:', user_ETH_Balance);
    console.log('pool_RCH_Balance:', pool_RCH_Balance);
    console.log('pool_WETH_Balance:', pool_WETH_Balance);


}

//blockNumber:20119158
swap()