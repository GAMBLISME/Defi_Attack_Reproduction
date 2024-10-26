const {ethers, network} = require("hardhat");

mainNetUrl = process.env.MAINNET_URL;

const uniswapV3FactoryAddr = '0x1F98431c8aD98523631AE4a59f267346ea31F984';
const nonFungiblePositionManagerAddr = '0xC36442b4a4522E871399CD717aBDD847Ab11FE88';
const swapRouterAddr = '0xE592427A0AEce92De3Edee1F18E0157C05861564';

const erc20Abi = require('../artifacts/contracts/interface.sol/IERC20.json').abi;
const nonFungiblePositionManagerAbi = require('../artifacts/contracts/interface.sol/INonfungiblePositionManager.json').abi;
const uniswapV3FactoryAbi = [{
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
}, {
    "anonymous": false,
    "inputs": [{"indexed": true, "internalType": "uint24", "name": "fee", "type": "uint24"}, {
        "indexed": true,
        "internalType": "int24",
        "name": "tickSpacing",
        "type": "int24"
    }],
    "name": "FeeAmountEnabled",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{"indexed": true, "internalType": "address", "name": "oldOwner", "type": "address"}, {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
    }],
    "name": "OwnerChanged",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{"indexed": true, "internalType": "address", "name": "token0", "type": "address"}, {
        "indexed": true,
        "internalType": "address",
        "name": "token1",
        "type": "address"
    }, {"indexed": true, "internalType": "uint24", "name": "fee", "type": "uint24"}, {
        "indexed": false,
        "internalType": "int24",
        "name": "tickSpacing",
        "type": "int24"
    }, {"indexed": false, "internalType": "address", "name": "pool", "type": "address"}],
    "name": "PoolCreated",
    "type": "event"
}, {
    "inputs": [{"internalType": "address", "name": "tokenA", "type": "address"}, {
        "internalType": "address",
        "name": "tokenB",
        "type": "address"
    }, {"internalType": "uint24", "name": "fee", "type": "uint24"}],
    "name": "createPool",
    "outputs": [{"internalType": "address", "name": "pool", "type": "address"}],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint24", "name": "fee", "type": "uint24"}, {
        "internalType": "int24",
        "name": "tickSpacing",
        "type": "int24"
    }], "name": "enableFeeAmount", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}, {
    "inputs": [{"internalType": "uint24", "name": "", "type": "uint24"}],
    "name": "feeAmountTickSpacing",
    "outputs": [{"internalType": "int24", "name": "", "type": "int24"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "", "type": "address"}, {
        "internalType": "address",
        "name": "",
        "type": "address"
    }, {"internalType": "uint24", "name": "", "type": "uint24"}],
    "name": "getPool",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "owner",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "parameters",
    "outputs": [{"internalType": "address", "name": "factory", "type": "address"}, {
        "internalType": "address",
        "name": "token0",
        "type": "address"
    }, {"internalType": "address", "name": "token1", "type": "address"}, {
        "internalType": "uint24",
        "name": "fee",
        "type": "uint24"
    }, {"internalType": "int24", "name": "tickSpacing", "type": "int24"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "_owner", "type": "address"}],
    "name": "setOwner",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}];


async function CreatePool() {
    const Token_STT_Addr = '0x0c1eD9A103C3fcfe22ee313b06c0ad5910C2126E';
    const Token_WETH_Addr = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';

    const userAddr = '0x9df451E5A4742175546BBc7D340Ced83dc7Ba63f';

    //交易哈希：https://etherscan.io/tx/0x9dbaee4a913c02ade04d125f5d497ad330264549b73679b9d57fb0755e7e9191

    await network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [userAddr],//要冒充的目标账户地址
    });
    const user = await ethers.provider.getSigner(userAddr);

    // 为账户增加 ETH
    const amount = ethers.toBeHex(ethers.parseEther('10'));
    console.log(`Adding ${amount} ETH to ${userAddr}`);
    await network.provider.request({
        method: "hardhat_setBalance",
        params: [userAddr, amount],
    });

    const feeHex = '0x0000000000000000000000000000000000000000000000000000000000002710';
    const sqrtPriceX96Hex = '0x00000000000000000000000000000000000000000000e4e2602ccdc892ff5c3a';

    // 将十六进制字符串转化为 BigNumber 对象
    const fee = BigInt(feeHex);
    const sqrtPriceX96 = BigInt(sqrtPriceX96Hex);

    const nonFungiblePositionManager = await ethers.getContractAt(nonFungiblePositionManagerAbi, nonFungiblePositionManagerAddr, user);
    const uniswapV3Factory = await ethers.getContractAt(uniswapV3FactoryAbi, uniswapV3FactoryAddr, user);
    const maxFeePerGas = (await ethers.provider.getFeeData()).maxFeePerGas;

    let PoolAddr = await uniswapV3Factory.getPool(Token_STT_Addr, Token_WETH_Addr, fee);
    console.log("Before create pool,the poolAddr is:", PoolAddr);

    const tx = await nonFungiblePositionManager.createAndInitializePoolIfNecessary(
        Token_STT_Addr,
        Token_WETH_Addr,
        fee,
        sqrtPriceX96,
        {
            maxFeePerGas: maxFeePerGas
        }
    );

    await tx.wait();  // 等待交易被确认


    PoolAddr = await uniswapV3Factory.getPool(Token_STT_Addr, Token_WETH_Addr, fee);
    console.log("After create pool,the poolAddr is:", PoolAddr);


}
//blockNumber: 20113257
CreatePool()