pragma solidity ^0.8.2;
// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/access/Ownable.sol";
import "../../DeadCoin.sol";

contract DEX is Ownable {
    DeadCoin public deadCoin;
    uint256 public constant TOKENS_PER_ETH = 100;
    uint256 public constant FEE_DENOM = 1000;

    event BuyTokens(address buyer, uint256 amountOfEth, uint256 amountOfTokens);

    error InsufficientLiquidity();
    error OverSelling();

    mapping(address => uint256) public orderBookSell;
    mapping(address => uint256) public orderBookBuy;

    constructor(address tokenAddress) {
        deadCoin = DeadCoin(tokenAddress);
    }

    modifier isOwner() {
        require(owner() == msg.sender, "Not Owner");
        _;
    }

    function calcFee(uint256 tradeAmount) public pure returns (uint256) {
        return tradeAmount * (1 / FEE_DENOM);
    }

    function buyTokens() public payable {
        uint256 toBuy = msg.value * TOKENS_PER_ETH;

        if (deadCoin.balanceOf(address(this)) < toBuy) {
            revert InsufficientLiquidity();
        }

        deadCoin.transfer(msg.sender, toBuy);
        emit BuyTokens(msg.sender, msg.value, toBuy);
    }

    function sellTokens(uint256 theAmount) public {
        if (deadCoin.balanceOf(msg.sender) < theAmount) revert OverSelling();

        uint256 payout = theAmount / TOKENS_PER_ETH;
        if (payout > address(this).balance) revert InsufficientLiquidity();

        deadCoin.transferFrom(msg.sender, address(this), theAmount);
        payable(msg.sender).transfer(payout);
    }
}
