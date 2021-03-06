// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";

import "contracts/skeletons/opensea/ERC721Tradable.sol";

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
