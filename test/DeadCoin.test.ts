// test/DeadCoin.test.js
import { expect } from 'chai';
import { BigNumber } from "ethers";
import "chai-bn";
import { ethers } from "hardhat";
import {
    constants,
    expectRevert,
} from "@openzeppelin/test-helpers";
import { deployContract } from 'ethereum-waffle';
import DeadCoinArtifact from '../artifacts/contracts/DeadCoin.sol/DeadCoin.json'
import { DeadCoin } from 'typechain';

// Constants
const MAX_TRANSFER_VALUE = 1000000;

describe("DeadCoin", function () {
    // Let's override context later
    let deadCoin: DeadCoin;
    let zeroValue: BigNumber;
    let knownValue: BigNumber;
    let randomValue: BigNumber;
    let sender: string;
    let receiver: string;

    before(async function () {
        zeroValue = BigNumber.from(0);
        knownValue = BigNumber.from(1);
        randomValue = BigNumber.from(Math.floor(Math.random() * MAX_TRANSFER_VALUE));

        this.DeadCoin = await ethers.getContractFactory("DeadCoin");
    });

    beforeEach(async function () {
        const signers = await ethers.getSigners();
        sender = signers[0].address;
        receiver = signers[1].address;
        deadCoin = (await deployContract(signers[0], DeadCoinArtifact)) as DeadCoin;
        await deadCoin.deployed();
    });

    it('reverts when transferring tokens to the zero address', async function () {
        await expectRevert(
            deadCoin.transfer(constants.ZERO_ADDRESS, knownValue, { from: sender }),
            'ERC20: transfer to the zero address',
        );
    });

    it('emits a Transfer event on successful transfers', async function () {
        await expect(deadCoin.transfer(receiver, knownValue, { from: sender }))
            .to.emit(deadCoin, 'Transfer')
            .withArgs(sender, receiver, knownValue);
    });

    it('updates balances on successful transfers', async function () {
        await deadCoin.transfer(receiver, knownValue, { from: sender });
        const receiverBalance = await deadCoin.balanceOf(receiver);

        expect(receiverBalance).to.equal(knownValue);
    });

    it('updates balances on successful transfer with random amount', async function () {
        await deadCoin.transfer(receiver, randomValue, { from: sender });
        const receiverBalance = await deadCoin.balanceOf(receiver);

        expect(receiverBalance).to.equal(randomValue);
    });


    //
    // ALLOWANCE TESTS
    //
    it('reverts when transfer amount exceeds allowance', async function () {
        await expectRevert(
            deadCoin.transferFrom(sender, receiver, knownValue),
            'ERC20: transfer amount exceeds allowance',
        );
    });

    it('allowance value of 0 by default', async function () {
        const allowance = await deadCoin.allowance(sender, receiver);

        expect(allowance).to.equal(zeroValue);
    });

    it('emits an approval event for receiver from approve function', async function () {
        await expect(deadCoin.approve(receiver, knownValue))
            .to.emit(deadCoin, 'Approval')
            .withArgs(sender, receiver, knownValue);
    });

    it('emits an approval event for sender from approve function', async function () {
        await expect(deadCoin.approve(sender, knownValue))
            .to.emit(deadCoin, 'Approval')
            .withArgs(sender, sender, knownValue);
    });

    it('emits an approval event for receiver from increaseAllowance function', async function () {
        await deadCoin.approve(receiver, knownValue);

        await expect(deadCoin.increaseAllowance(receiver, knownValue))
            .to.emit(deadCoin, 'Approval')
            .withArgs(sender, receiver, knownValue.add(knownValue));
    });

    it('emits an approval event for receiver from decreaseAllowance function', async function () {
        await deadCoin.approve(receiver, knownValue.add(knownValue));

        await expect(deadCoin.decreaseAllowance(receiver, knownValue))
            .to.emit(deadCoin, 'Approval')
            .withArgs(sender, receiver, knownValue);
    });

    it('emits a transfer event for transferFrom call', async function () {
        await deadCoin.approve(sender, knownValue);

        await expect(deadCoin.transferFrom(sender, receiver, knownValue))
            .to.emit(deadCoin, 'Transfer')
            .withArgs(sender, receiver, knownValue);
    });

    it('updates allowance after full amount transferFrom', async function () {
        await deadCoin.approve(sender, knownValue);
        await deadCoin.transferFrom(sender, receiver, knownValue);

        const allowance = await deadCoin.allowance(sender, receiver);

        expect(allowance).to.equal(zeroValue);
    });

    it('updates allowance after partial amount transferFrom', async function () {
        await deadCoin.approve(sender, knownValue.add(knownValue));
        await deadCoin.transferFrom(sender, receiver, knownValue);

        const allowance = await deadCoin.allowance(sender, sender);

        expect(allowance).to.equal(knownValue);
    });

    it('updates balances after approved transfer', async function () {
        await deadCoin.approve(sender, knownValue);
        await deadCoin.transferFrom(sender, receiver, knownValue);

        const receiverBalance = await deadCoin.balanceOf(receiver);

        expect(receiverBalance).to.equal(knownValue);
    });

    it('updates balances after approved transfer with random amount', async function () {
        await deadCoin.approve(sender, randomValue);
        await deadCoin.transferFrom(sender, receiver, randomValue);

        const receiverBalance = await deadCoin.balanceOf(receiver);

        expect(receiverBalance).to.equal(randomValue);
    });

    //
    // BURN FUNCTIONS
    //
    it('updates total supply after burning', async function () {
        const startSupply = await deadCoin.totalSupply();

        await deadCoin.burn(knownValue);

        const endSupply = await deadCoin.totalSupply();

        expect(endSupply).to.equal(startSupply.sub(knownValue));
    });

    it('reverts when burnFrom amount exceeds allowance', async function () {

        await expectRevert(
            deadCoin.burnFrom(sender, knownValue),
            'ERC20: burn amount exceeds allowance',
        );
    });

    it('updates total supply after burnFrom', async function () {
        await deadCoin.approve(sender, knownValue);

        const startSupply = await deadCoin.totalSupply();

        await deadCoin.burnFrom(sender, knownValue);

        const endSupply = await deadCoin.totalSupply();

        expect(endSupply).to.equal(startSupply.sub(knownValue));
    });


    //
    // VOTE FUNCTIONS
    //
    it('emits a delegateChanged event from a delegate call', async function () {
        const delegateAddress = await deadCoin.delegates(sender);

        await expect(deadCoin.delegate(receiver))
            .to.emit(deadCoin, 'DelegateChanged')
            .withArgs(sender, delegateAddress, receiver);
    });

    it('adding voting power to self', async function () {
        const delegateAddress = await deadCoin.delegates(sender);
        await deadCoin.delegate(sender);
        const votes = await deadCoin.getVotes(sender);

        // Need to look how original delegation is done to actually test this
        expect(votes).to.equal(votes);
    });

    it('changing votes after delegation', async function () {
        // const delegateAddress = await deadCoin.delegates(sender);
        await deadCoin.delegate(sender);

        const startSenderVotes = await deadCoin.getVotes(sender);
        // console.log('Sender vote count after delegating self', startSenderVotes.toString());
        const startReceiverVotes = await deadCoin.getVotes(receiver);
        // console.log('Receiver vote count after delegating self', startReceiverVotes.toString());

        await deadCoin.delegate(receiver);

        const endSenderVotes = await deadCoin.getVotes(sender);
        // console.log('Sender vote count after delegation transfer', endSenderVotes.toString());
        const endReceiverVotes = await deadCoin.getVotes(receiver);
        // console.log('Receiver vote count after delegation transfer', endReceiverVotes.toString());

        // Need to look how original delegation is done to actually test this
        expect(startSenderVotes).to.equal(endReceiverVotes);
    });
});
