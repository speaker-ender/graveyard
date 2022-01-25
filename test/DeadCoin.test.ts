// test/DeadCoin.test.js
import { expect } from 'chai';
import { BigNumber } from "ethers";
import "chai-bn";
import { ethers, deployments } from "hardhat";
import 'hardhat-deploy';
import {
    constants,
    expectRevert,
} from "@openzeppelin/test-helpers";
import { DeadCoin } from 'typechain-types';
import * as dotenv from "dotenv";
import { getAccounts, getTestValues } from './helpers/Setup';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

dotenv.config();

// Constants
const MAX_TRANSFER_VALUE = 1000000;

describe("DeadCoin", function () {
    // Let's override context later
    let deadCoin: DeadCoin;
    let zeroValue: BigNumber;
    let knownValue: BigNumber;
    let randomValue: BigNumber;
    let senderAddress: string;
    let senderAccount: SignerWithAddress;
    let receiverAddress: string;
    let receiverAccount: SignerWithAddress;

    before(async function () {
        ; ({ zeroValue, knownValue, randomValue } = getTestValues(MAX_TRANSFER_VALUE));
        ; ({ senderAccount, senderAddress, receiverAccount, receiverAddress } = await getAccounts());
    });

    beforeEach(async function () {
        await deployments.fixture(["DeadCoin"]);
        deadCoin = await ethers.getContract('DeadCoin');
    });

    it('reverts when transferring tokens to the zero address', async function () {
        await expectRevert(
            deadCoin.transfer(constants.ZERO_ADDRESS, knownValue, { from: senderAddress }),
            'ERC20: transfer to the zero address',
        );
    });

    it('emits a Transfer event on successful transfers', async function () {
        await expect(deadCoin.transfer(receiverAddress, knownValue, { from: senderAddress }))
            .to.emit(deadCoin, 'Transfer')
            .withArgs(senderAddress, receiverAddress, knownValue);
    });

    it('updates balances on successful transfers', async function () {
        await deadCoin.transfer(receiverAddress, knownValue, { from: senderAddress });
        const receiverBalance = await deadCoin.balanceOf(receiverAddress);

        expect(receiverBalance).to.equal(knownValue);
    });

    it('updates balances on successful transfer with random amount', async function () {
        await deadCoin.transfer(receiverAddress, randomValue, { from: senderAddress });
        const receiverBalance = await deadCoin.balanceOf(receiverAddress);

        expect(receiverBalance).to.equal(randomValue);
    });


    //
    // ALLOWANCE TESTS
    //
    it('reverts when transfer amount exceeds allowance', async function () {
        await expectRevert(
            deadCoin.transferFrom(senderAddress, receiverAddress, knownValue),
            'ERC20: transfer amount exceeds allowance',
        );
    });

    it('allowance value of 0 by default', async function () {
        const allowance = await deadCoin.allowance(senderAddress, receiverAddress);

        expect(allowance).to.equal(zeroValue);
    });

    it('emits an approval event for receiverAddress from approve function', async function () {
        await expect(deadCoin.approve(receiverAddress, knownValue))
            .to.emit(deadCoin, 'Approval')
            .withArgs(senderAddress, receiverAddress, knownValue);
    });

    it('emits an approval event for senderAddress from approve function', async function () {
        await expect(deadCoin.approve(senderAddress, knownValue))
            .to.emit(deadCoin, 'Approval')
            .withArgs(senderAddress, senderAddress, knownValue);
    });

    it('emits an approval event for receiverAddress from increaseAllowance function', async function () {
        await deadCoin.approve(receiverAddress, knownValue);

        await expect(deadCoin.increaseAllowance(receiverAddress, knownValue))
            .to.emit(deadCoin, 'Approval')
            .withArgs(senderAddress, receiverAddress, knownValue.add(knownValue));
    });

    it('emits an approval event for receiverAddress from decreaseAllowance function', async function () {
        await deadCoin.approve(receiverAddress, knownValue.add(knownValue));

        await expect(deadCoin.decreaseAllowance(receiverAddress, knownValue))
            .to.emit(deadCoin, 'Approval')
            .withArgs(senderAddress, receiverAddress, knownValue);
    });

    it('emits a transfer event for transferFrom call', async function () {
        await deadCoin.approve(senderAddress, knownValue);

        await expect(deadCoin.transferFrom(senderAddress, receiverAddress, knownValue))
            .to.emit(deadCoin, 'Transfer')
            .withArgs(senderAddress, receiverAddress, knownValue);
    });

    it('updates allowance after full amount transferFrom', async function () {
        await deadCoin.approve(senderAddress, knownValue);
        await deadCoin.transferFrom(senderAddress, receiverAddress, knownValue);

        const allowance = await deadCoin.allowance(senderAddress, receiverAddress);

        expect(allowance).to.equal(zeroValue);
    });

    it('updates allowance after partial amount transferFrom', async function () {
        await deadCoin.approve(senderAddress, knownValue.add(knownValue));
        await deadCoin.transferFrom(senderAddress, receiverAddress, knownValue);

        const allowance = await deadCoin.allowance(senderAddress, senderAddress);

        expect(allowance).to.equal(knownValue);
    });

    it('updates balances after approved transfer', async function () {
        await deadCoin.approve(senderAddress, knownValue);
        await deadCoin.transferFrom(senderAddress, receiverAddress, knownValue);

        const receiverBalance = await deadCoin.balanceOf(receiverAddress);

        expect(receiverBalance).to.equal(knownValue);
    });

    it('updates balances after approved transfer with random amount', async function () {
        await deadCoin.approve(senderAddress, randomValue);
        await deadCoin.transferFrom(senderAddress, receiverAddress, randomValue);

        const receiverBalance = await deadCoin.balanceOf(receiverAddress);

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
            deadCoin.burnFrom(senderAddress, knownValue),
            'ERC20: burn amount exceeds allowance',
        );
    });

    it('updates total supply after burnFrom', async function () {
        await deadCoin.approve(senderAddress, knownValue);

        const startSupply = await deadCoin.totalSupply();

        await deadCoin.burnFrom(senderAddress, knownValue);

        const endSupply = await deadCoin.totalSupply();

        expect(endSupply).to.equal(startSupply.sub(knownValue));
    });


    //
    // VOTE FUNCTIONS
    //
    it('emits a delegateChanged event from a delegate call', async function () {
        const delegateAddress = await deadCoin.delegates(senderAddress);

        await expect(deadCoin.delegate(receiverAddress))
            .to.emit(deadCoin, 'DelegateChanged')
            .withArgs(senderAddress, delegateAddress, receiverAddress);
    });

    it('adding voting power to self', async function () {
        const delegateAddress = await deadCoin.delegates(senderAddress);
        await deadCoin.delegate(senderAddress);
        const votes = await deadCoin.getVotes(senderAddress);

        // Need to look how original delegation is done to actually test this
        expect(votes).to.equal(votes);
    });

    it('changing votes after delegation', async function () {
        // const delegateAddress = await deadCoin.delegates(senderAddress);
        await deadCoin.delegate(senderAddress);

        const startSenderVotes = await deadCoin.getVotes(senderAddress);
        // console.log('Sender vote count after delegating self', startSenderVotes.toString());
        const startReceiverVotes = await deadCoin.getVotes(receiverAddress);
        // console.log('Receiver vote count after delegating self', startReceiverVotes.toString());

        await deadCoin.delegate(receiverAddress);

        const endSenderVotes = await deadCoin.getVotes(senderAddress);
        // console.log('Sender vote count after delegation transfer', endSenderVotes.toString());
        const endReceiverVotes = await deadCoin.getVotes(receiverAddress);
        // console.log('Receiver vote count after delegation transfer', endReceiverVotes.toString());

        // Need to look how original delegation is done to actually test this
        expect(startSenderVotes).to.equal(endReceiverVotes);
    });

    //
    // Spawn Functions
    // 
    it('emits a spawn event for spawn function call', async function () {
        await expect(deadCoin.spawn(senderAddress, knownValue))
            .to.emit(deadCoin, 'Spawn')
            .withArgs(senderAddress, senderAddress, knownValue.mul(2));

    });

    it('reverts when spawn amount exceeds balance', async function () {
        const spawnerBalance = await deadCoin.balanceOf(senderAddress);

        await expectRevert(
            deadCoin.spawn(senderAddress, spawnerBalance.add(1)),
            'ERC20: burn amount exceeds balance',
        );
    });

    it('updates balances on successful spawn', async function () {
        const startBalance = await deadCoin.balanceOf(senderAddress);
        await deadCoin.spawn(senderAddress, knownValue);
        const endBalance = await deadCoin.balanceOf(senderAddress);

        expect(endBalance).to.equal(startBalance.add(knownValue));
    });
});
