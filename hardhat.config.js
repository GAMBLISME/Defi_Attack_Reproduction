/** @type import('hardhat/config').HardhatUserConfig */
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("hardhat-tracer");

ALCHEMY_SEPOLIA_URL = process.env.ALCHEMY_SEPOLIA_URL;
PRIVATE_KEY = process.env.PRIVATE_KEY;
BNB_MAINNET_URL = process.env.BNB_MAINNET_URL;
mainNetUrl = process.env.MAINNET_URL;
polyGonMainNetUrl = process.env.POLYGON_MAINNET_URL;


module.exports = {
    solidity: {
        compilers: [

            {
                version: "0.8.8"
            },
            {
                version: "0.6.0"
            },
            {
                version: "0.8.20"
            },
            {
                version: "0.5.16"
            }

        ]

    },
    defaultNetwork: "hardhat",
    networks: {
        sepolia: {
            url: ALCHEMY_SEPOLIA_URL,
            accounts: [PRIVATE_KEY],
        },
        hardhat: {
            forking: {
                url: BNB_MAINNET_URL,
                blockNumber: 18446845
            }
        }
    }


}