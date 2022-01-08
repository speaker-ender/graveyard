// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "hardhat/console.sol";

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./skeletons/opensea/CreatureLootBox.sol";

import "./skeletons/bones/IERC721Factory.sol";
import "./Formic.sol";

/// @custom:security-contact speaker_ender@protonmail.com
contract FormicFactory is IERC721Factory, Ownable {
    using Strings for string;

    event Transfer(
        address indexed from,
        address indexed to,
        uint256 indexed tokenId
    );

    address public proxyRegistryAddress;
    address public nftAddress;
    address public lootBoxNftAddress;
    string public baseURI = "https://formic.club/";

    uint256 FORMIC_SUPPLY = 1000;

    /*
     * Three different options for minting Formics (basic, premium, and gold).
     */
    uint256 NUM_OPTIONS = 3;
    uint256 SINGLE_FORMIC_OPTION = 0;
    uint256 MULTIPLE_FORMIC_OPTION = 1;
    uint256 LOOTBOX_OPTION = 2;
    uint256 NUM_FORMICS_IN_MULTIPLE_FORMIC_OPTION = 4;

    constructor(address _proxyRegistryAddress, address _nftAddress) {
        proxyRegistryAddress = _proxyRegistryAddress;
        nftAddress = _nftAddress;
        lootBoxNftAddress = address(
            new CreatureLootBox(_proxyRegistryAddress, address(this))
        );

        fireTransferEvents(address(0), owner());
    }

    function name() external pure override returns (string memory) {
        return "Formic Sale";
    }

    function symbol() external pure override returns (string memory) {
        return "FRM";
    }

    function supportsFactoryInterface() public pure override returns (bool) {
        return true;
    }

    function numOptions() public view override returns (uint256) {
        return NUM_OPTIONS;
    }

    function transferOwnership(address newOwner) public override onlyOwner {
        address _prevOwner = owner();
        super.transferOwnership(newOwner);
        fireTransferEvents(_prevOwner, newOwner);
    }

    function fireTransferEvents(address _from, address _to) private {
        for (uint256 i = 0; i < NUM_OPTIONS; i++) {
            emit Transfer(_from, _to, i);
        }
    }

    function mint(uint256 _optionId, address _toAddress) public override {
        // Must be sent from the owner proxy or owner.
        ProxyRegistry proxyRegistry = ProxyRegistry(proxyRegistryAddress);
        assert(
            address(proxyRegistry.proxies(owner())) == _msgSender() ||
                owner() == _msgSender() ||
                _msgSender() == lootBoxNftAddress
        );
        require(canMint(_optionId));

        Formic formic = Formic(nftAddress);
        formic.mintTo(_toAddress);
    }

    function mint(
        uint256 _optionId,
        address _toAddress,
        uint256 _formic_count
    ) public override {
        // Must be sent from the owner proxy or owner.
        ProxyRegistry proxyRegistry = ProxyRegistry(proxyRegistryAddress);
        assert(
            address(proxyRegistry.proxies(owner())) == _msgSender() ||
                owner() == _msgSender() ||
                _msgSender() == lootBoxNftAddress
        );
        require(canMint(_optionId));

        Formic formic = Formic(nftAddress);
        for (uint256 i = 0; i < _formic_count; i++) {
            formic.mintTo(_toAddress);
        }
    }

    function canMint(uint256 _optionId) public view override returns (bool) {
        if (_optionId >= NUM_OPTIONS) {
            return false;
        }

        Formic formic = Formic(nftAddress);
        uint256 formicSupply = formic.totalSupply();

        uint256 numItemsAllocated = 0;
        if (_optionId == SINGLE_FORMIC_OPTION) {
            numItemsAllocated = 1;
        } else if (_optionId == MULTIPLE_FORMIC_OPTION) {
            numItemsAllocated = NUM_FORMICS_IN_MULTIPLE_FORMIC_OPTION;
        } else if (_optionId == LOOTBOX_OPTION) {
            CreatureLootBox openSeaCreatureLootBox = CreatureLootBox(
                lootBoxNftAddress
            );
            numItemsAllocated = openSeaCreatureLootBox.itemsPerLootbox();
        }
        return formicSupply < (FORMIC_SUPPLY - numItemsAllocated);
    }

    function tokenURI(uint256 _optionId)
        external
        view
        override
        returns (string memory)
    {
        return string(abi.encodePacked(baseURI, Strings.toString(_optionId)));
    }

    /**
     * Hack to get things to work automatically on OpenSea.
     * Use transferFrom so the frontend doesn't have to worry about different method names.
     */
    function transferFrom(
        address,
        address _to,
        uint256 _tokenId
    ) public {
        mint(_tokenId, _to);
    }

    /**
     * Hack to get things to work automatically on OpenSea.
     * Use isApprovedForAll so the frontend doesn't have to worry about different method names.
     */
    function isApprovedForAll(address _owner, address _operator)
        public
        view
        returns (bool)
    {
        if (owner() == _owner && _owner == _operator) {
            return true;
        }

        ProxyRegistry proxyRegistry = ProxyRegistry(proxyRegistryAddress);
        if (
            owner() == _owner &&
            address(proxyRegistry.proxies(_owner)) == _operator
        ) {
            return true;
        }

        return false;
    }

    /**
     * Hack to get things to work automatically on OpenSea.
     * Use isApprovedForAll so the frontend doesn't have to worry about different method names.
     */
    function ownerOf(uint256) public view returns (address _owner) {
        return owner();
    }
}
