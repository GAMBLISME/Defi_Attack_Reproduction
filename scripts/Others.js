const {ethers, network} = require("hardhat");

mainNetUrl = process.env.MAINNET_URL;
const provider = new ethers.JsonRpcProvider(mainNetUrl);

async function main() {
    const gasPrice = (await provider.getFeeData()).gasPrice;
    console.log("Gas Price: ", ethers.formatUnits(gasPrice, "gwei"));

    // const gasAmount = BigInt(3285296); // 将 gasAmount 也转换为 BigInt
    // const gasFee = gasPrice * gasAmount; // 确保两个操作数都是 BigInt
    //
    // console.log("Gas Fee: ", ethers.formatEther(gasFee)); // 使用 toString() 来格式化输出
}

main()