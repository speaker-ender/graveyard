pragma solidity ^0.8.2;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";

contract MediumRareStake {
    uint256 public constant THRESHOLD = 1 ether;
    uint256 public deadline = block.timestamp + 72 hours;
    bool public successfulStake;
    bool public openForWithdraw;

    mapping(address => uint256) public balances;

    event Stake(address indexed staker, uint256 indexed amount);

    error StakingEnded();
    error NotWithdrawable();

    constructor() public {}

    modifier notCompleted() {
        require(!successfulStake, "Completed");
        _;
    }

    function stake() public payable {
        if (successfulStake || openForWithdraw) revert StakingEnded();
        balances[msg.sender] += msg.value;
        emit Stake(msg.sender, msg.value);
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
        }
    }

    function withdraw(address payable) public notCompleted {
        if (openForWithdraw) {
            uint256 balance = balances[msg.sender];
            balances[msg.sender] = 0;
            payable(msg.sender).transfer(balance);
        } else {
            revert NotWithdrawable();
        }
    }

    function timeLeft() public view returns (uint256) {
        uint256 rawTimeLeft = deadline - block.timestamp;

        return rawTimeLeft <= 0 ? 0 : rawTimeLeft;
    }

    receive() external payable {
        stake();
    }
}
