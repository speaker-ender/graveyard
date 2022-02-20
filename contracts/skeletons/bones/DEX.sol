pragma solidity ^0.8.2;
// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/access/Ownable.sol";
import "../../DeadCoin.sol";
import "./MediumRareStake.sol";

uint256 constant FEE_DENOM = 1000;

contract DEX is Ownable {
    DeadCoin public deadCoin;
    MediumRareStake public mediumRareStake;
    uint256 public constant TOKENS_PER_ETH = 100;
    address public immutable stakeAddress;

    event Funded(address funder, uint256 amountOfEth);
    event BuyTokens(address buyer, uint256 amountOfEth, uint256 amountOfTokens);
    event SellTokens(
        address seller,
        uint256 amountOfEth,
        uint256 amountOfTokens
    );

    error InsufficientLiquidity();
    error OverSelling();

    constructor(address tokenAddress, address intStakeAddress) {
        deadCoin = DeadCoin(tokenAddress);
        mediumRareStake = MediumRareStake(intStakeAddress);
        stakeAddress = intStakeAddress;
    }

    modifier isOwner() {
        require(owner() == msg.sender, "Not Owner");
        _;
    }

    function hasMinimumTransaction(uint256 txValue) public pure {
        require(txValue > FEE_DENOM * 10, "Min Value Not Met");
    }

    function calcFee(uint256 tradeAmount) public pure returns (uint256) {
        return ((tradeAmount * 1001) / 1000) - tradeAmount;
    }

    function buyTokens() public payable {
        hasMinimumTransaction(msg.value);

        uint256 fee = calcFee(msg.value);

        uint256 toBuy = msg.value * TOKENS_PER_ETH;

        if (deadCoin.balanceOf(address(this)) < toBuy) {
            revert InsufficientLiquidity();
        }

        deadCoin.approve(stakeAddress, fee);
        mediumRareStake.depositFees(fee);

        uint256 toTransfer = toBuy - fee;

        deadCoin.transfer(msg.sender, toTransfer);

        emit BuyTokens(msg.sender, msg.value, toTransfer);
    }

    function sellTokens(uint256 sellAmount) public {
        if (deadCoin.balanceOf(msg.sender) < sellAmount) revert OverSelling();

        uint256 raw_payout = sellAmount / TOKENS_PER_ETH;
        uint256 fee = calcFee(raw_payout);
        uint256 actual_payout = raw_payout - fee;

        hasMinimumTransaction(raw_payout);

        if (raw_payout > address(this).balance) revert InsufficientLiquidity();

        deadCoin.transferFrom(msg.sender, address(this), sellAmount);

        deadCoin.approve(stakeAddress, fee);
        mediumRareStake.depositFees(fee);

        payable(msg.sender).transfer(actual_payout);
        emit SellTokens(msg.sender, actual_payout, sellAmount);
    }

    receive() external payable {
        emit Funded(msg.sender, msg.value);
    }
}
