// test/DEX.test.js
import { expect } from 'chai';
import { BigNumber } from "ethers";
import "chai-bn";
import { ethers, deployments } from "hardhat";
import 'hardhat-deploy';
import {
    constants,
    expectRevert,
} from "@openzeppelin/test-helpers";
import { DeadCoin, DEX } from 'typechain-types';
import * as dotenv from "dotenv";
import { getAccounts, getTestValues } from './helpers/Setup';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { parseEther } from 'ethers/lib/utils';

dotenv.config();

// Constants
const MAX_TRANSFER_VALUE = 1000000;

describe("DEX", function () {
    // Let's override context later
    let deadCoin: DeadCoin;
    let DEX: DEX;
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
        await deployments.fixture(["DEX"]);
        DEX = await ethers.getContract('DEX');
        deadCoin = await ethers.getContract('DeadCoin');
    });

    describe("buyTokens function", function () {
        beforeEach(async function () {
            await deadCoin.transfer(DEX.address, parseEther('50'));
        });

        it('correct DEX eth balance on buy', async function () {
            const startEthBalance = await ethers.provider.getBalance(DEX.address);
            await DEX.connect(receiverAccount).buyTokens({ value: knownValue });
            const endEthBalance = await ethers.provider.getBalance(DEX.address);

            expect(endEthBalance).to.equal((startEthBalance).add(knownValue));
        });

        it('correct Buyer eth balance on buy', async function () {
            const startEthBalance = await ethers.provider.getBalance(receiverAddress);
            const receipt = await (await DEX.connect(receiverAccount).buyTokens({ value: knownValue })).wait();
            const endEthBalance = await ethers.provider.getBalance(receiverAddress);

            // Annoying way to account for TX fees
            const totalCost = knownValue.add(receipt.cumulativeGasUsed.mul(receipt.effectiveGasPrice));

            expect(endEthBalance).to.equal((startEthBalance).sub(totalCost));
        });

        it('correct DEX coin balance on buy', async function () {
            const startCoinBalance = await deadCoin.balanceOf(DEX.address);
            await DEX.connect(receiverAccount).buyTokens({ value: knownValue });
            const endCoinBalance = await deadCoin.balanceOf(DEX.address);

            expect(endCoinBalance).to.equal((startCoinBalance).sub(knownValue.mul(await DEX.TOKENS_PER_ETH())));
        });

        it('correct Buyer coin balance on buy', async function () {
            const startCoinBalance = await deadCoin.balanceOf(receiverAddress);
            await DEX.connect(receiverAccount).buyTokens({ value: knownValue });
            const endCoinBalance = await deadCoin.balanceOf(receiverAddress);

            expect(endCoinBalance).to.equal((startCoinBalance).add(knownValue.mul(await DEX.TOKENS_PER_ETH())));
        });

        it('correct event emitted on buy', async function () {
            expect(DEX.buyTokens({ value: knownValue })).to.emit(DEX, 'BuyTokens').withArgs(senderAddress, knownValue, knownValue.mul(await DEX.TOKENS_PER_ETH()));
        });

    });

    describe("sellTokens function", function () {
        beforeEach(async function () {
            await deadCoin.transfer(receiverAddress, parseEther('50'));
            await senderAccount.sendTransaction({ to: DEX.address, value: parseEther('2') })
        });

        it('correct DEX eth balance on sell', async function () {
            const startEthBalance = await ethers.provider.getBalance(DEX.address);
            await deadCoin.connect(receiverAccount).approve(DEX.address, knownValue);
            await DEX.connect(receiverAccount).sellTokens(knownValue);
            const endEthBalance = await ethers.provider.getBalance(DEX.address);

            expect(endEthBalance).to.equal((startEthBalance).sub(knownValue.div(await DEX.TOKENS_PER_ETH())));
        });

        it('correct DEX coin balance on sell', async function () {
            const startCoinBalance = await deadCoin.balanceOf(DEX.address);
            await deadCoin.connect(receiverAccount).approve(DEX.address, knownValue);
            await DEX.connect(receiverAccount).sellTokens(knownValue);
            const endCoinBalance = await deadCoin.balanceOf(DEX.address);

            expect(endCoinBalance).to.equal((startCoinBalance).add(knownValue));
        });

        it('correct event emitted on sell', async function () {
            await deadCoin.connect(receiverAccount).approve(DEX.address, knownValue);

            expect(DEX.connect(receiverAccount).sellTokens(knownValue)).to.emit(DEX, 'SellTokens').withArgs(senderAddress, knownValue.div(await DEX.TOKENS_PER_ETH()), knownValue);
        });

    });
});
