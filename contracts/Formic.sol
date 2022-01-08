// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "hardhat/console.sol";

import "contracts/skeletons/opensea/ERC721Tradable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @custom:security-contact speaker_ender@protonmail.com
contract Formic is ERC721Tradable {
    constructor(address _proxyRegistryAddress)
        ERC721Tradable("Formic", "FRM", _proxyRegistryAddress)
    {}

    function baseTokenURI() public pure override returns (string memory) {
        return "https://formic.club/";
    }

    function contractURI() public pure returns (string memory) {
        return "https://formic.club/contract/formic";
    }
}
