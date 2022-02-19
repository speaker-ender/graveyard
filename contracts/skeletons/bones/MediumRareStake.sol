pragma solidity ^0.8.2;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "../../DeadCoin.sol";

uint256 constant THRESHOLD = 1 ether;

contract MediumRareStake {
    DeadCoin public deadCoin;
    uint256 public immutable deadline;
    uint256 public stakerCount = 0;

    address public feePoolAddress;
    uint256 public feeBalance;

    bool public successfulStake;
    bool public openForWithdraw;

    mapping(address => uint256) public balances;
    mapping(address => uint256) public deadCoinBalances;

    event Stake(address indexed staker, uint256 indexed amount);
    event Execute(bool successful);
    event Withdraw(address indexed staker, uint256 amount);

    error StakingEnded();
    error NotWithdrawable();
    error DeadlineNotMet();

    constructor(address tokenAddress) {
        deadCoin = DeadCoin(tokenAddress);
        deadline = block.timestamp + 60 seconds;
    }

    modifier notCompleted() {
        require(!successfulStake, "Completed");
        _;
    }

    function stake() public payable {
        if (successfulStake || openForWithdraw) revert StakingEnded();
        balances[msg.sender] += msg.value;
        emit Stake(msg.sender, msg.value);
    }

    function stakeDead(uint256 coinAmount) public payable {
        deadCoin.transferFrom(msg.sender, address(this), coinAmount);

        if (deadCoinBalances[msg.sender] == 0) {
            stakerCount++;
        }

        deadCoinBalances[msg.sender] += coinAmount;

        emit Stake(msg.sender, coinAmount);
    }

    function depositFees(uint256 coinAmount) public payable {
        feeBalance += coinAmount;
        deadCoin.transferFrom(msg.sender, address(this), coinAmount);
    }

    function execute() public notCompleted {
        if (block.timestamp > deadline) {
            if (address(this).balance >= THRESHOLD) {
                successfulStake = true;
                // exampleExternalContract.complete{
                //     value: address(this).balance
                // }();
            } else {
                openForWithdraw = true;
            }

            emit Execute(successfulStake);
        } else {
            revert DeadlineNotMet();
        }
    }

    function withdraw(address payable) public notCompleted {
        if (openForWithdraw) {
            uint256 balance = balances[msg.sender];
            balances[msg.sender] = 0;
            payable(msg.sender).transfer(balance);
            emit Withdraw(msg.sender, balance);
        } else {
            revert NotWithdrawable();
        }
    }

    function withdrawWithFeeAccural(address payable) public {
        uint256 initialBalance = deadCoinBalances[msg.sender];
        deadCoinBalances[msg.sender] = 0;
        uint256 toWithdraw = initialBalance +
            deadCoinBalances[feePoolAddress] /
            stakerCount;

        deadCoin.transfer(msg.sender, toWithdraw);
        stakerCount--;

        emit Withdraw(msg.sender, toWithdraw);
    }

    function timeLeft() public view returns (uint256) {
        uint256 rawTimeLeft = deadline - block.timestamp;

        return rawTimeLeft <= 0 ? 0 : rawTimeLeft;
    }
}
