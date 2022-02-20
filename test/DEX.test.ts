// test/DEX.test.js
import { expect } from 'chai';
import { BigNumber } from "ethers";
import "chai-bn";
import { ethers, deployments } from "hardhat";
import 'hardhat-deploy';
import { DeadCoin, DEX, MediumRareStake } from 'typechain-types';
import * as dotenv from "dotenv";
import { getAccounts, getTestValues } from './helpers/Setup';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { parseEther } from 'ethers/lib/utils';
import { getBalance } from './helpers/Balances';

dotenv.config();

// Constants
const MAX_TRANSFER_VALUE = 1000000;

describe("DEX", function () {
    // Let's override context later
    let deadCoin: DeadCoin;
    let mediumRareStake: MediumRareStake;
    let DEX: DEX;
    let zeroValue: BigNumber;
    let knownValue: BigNumber;
    let ethValue: BigNumber;
    let randomValue: BigNumber;
    let senderAddress: string;
    let senderAccount: SignerWithAddress;
    let receiverAddress: string;
    let receiverAccount: SignerWithAddress;

    before(async function () {
        ; ({ zeroValue, knownValue, ethValue, randomValue } = getTestValues(MAX_TRANSFER_VALUE));
        ; ({ senderAccount, senderAddress, receiverAccount, receiverAddress } = await getAccounts());
    });

    beforeEach(async function () {
        await deployments.fixture(["DEX"]);
        DEX = await ethers.getContract('DEX');
        deadCoin = await ethers.getContract('DeadCoin');
        mediumRareStake = await ethers.getContract('MediumRareStake');

    });

    describe("buyTokens function", function () {
        beforeEach(async function () {
            await deadCoin.transfer(DEX.address, parseEther('100'));
        });

        describe("DEX Balances", function () {
            it('correct eth balance on buy', async function () {
                const startBalance = await getBalance(DEX.address);
                await DEX.connect(receiverAccount).buyTokens({ value: ethValue });
                const endBalance = await getBalance(DEX.address);

                expect(endBalance).to.equal(startBalance.add(ethValue));
            });

            it('correct coin balance on buy', async function () {
                const startCoinBalance = await deadCoin.balanceOf(DEX.address);
                await DEX.connect(receiverAccount).buyTokens({ value: ethValue });
                const endCoinBalance = await deadCoin.balanceOf(DEX.address);

                expect(endCoinBalance).to.equal((startCoinBalance).sub(ethValue.mul(await DEX.TOKENS_PER_ETH())));
            });
        });

        describe("Buyer Balances", function () {
            it('correct eth balance on buy', async function () {
                const startEthBalance = await ethers.provider.getBalance(receiverAddress);
                const receipt = await (await DEX.connect(receiverAccount).buyTokens({ value: ethValue })).wait();
                const endEthBalance = await ethers.provider.getBalance(receiverAddress);

                // Annoying way to account for TX fees
                const totalCost = ethValue.add(receipt.cumulativeGasUsed.mul(receipt.effectiveGasPrice));

                expect(endEthBalance).to.equal((startEthBalance).sub(totalCost));
            });

            it('correct coin balance on buy', async function () {
                const startCoinBalance = await deadCoin.balanceOf(receiverAddress);
                await DEX.connect(receiverAccount).buyTokens({ value: ethValue });
                const endCoinBalance = await deadCoin.balanceOf(receiverAddress);
                const fee = await DEX.calcFee(ethValue);

                expect(endCoinBalance).to.equal((startCoinBalance).add(ethValue.mul(await DEX.TOKENS_PER_ETH())).sub(fee));
            });
        });

        it('correct event emitted', async function () {
            const fee = await DEX.calcFee(ethValue);

            expect(DEX.buyTokens({ value: ethValue })).to.emit(DEX, 'BuyTokens').withArgs(senderAddress, ethValue, ethValue.mul(await DEX.TOKENS_PER_ETH()).sub(fee));
        });

    });

    describe("sellTokens function", function () {
        beforeEach(async function () {
            await deadCoin.transfer(receiverAddress, parseEther('50'));
            await senderAccount.sendTransaction({ to: DEX.address, value: parseEther('4') })
        });


        describe("DEX Balances", function () {
            it('correct eth balance change', async function () {
                const startEthBalance = await ethers.provider.getBalance(DEX.address);
                await deadCoin.connect(receiverAccount).approve(DEX.address, ethValue);
                await DEX.connect(receiverAccount).sellTokens(ethValue);
                const endEthBalance = await ethers.provider.getBalance(DEX.address);
                const fee = await DEX.calcFee(ethValue);

                expect(endEthBalance).to.equal((startEthBalance).sub(ethValue.sub(fee).div(await DEX.TOKENS_PER_ETH())));
            });

            it('correct coin balance change', async function () {
                const startCoinBalance = await deadCoin.balanceOf(DEX.address);
                await deadCoin.connect(receiverAccount).approve(DEX.address, ethValue);
                await DEX.connect(receiverAccount).sellTokens(ethValue);
                const endCoinBalance = await deadCoin.balanceOf(DEX.address);
                const fee = await DEX.calcFee(ethValue);

                expect(endCoinBalance).to.equal((startCoinBalance).add(ethValue).sub(fee));
            });
        });

        describe("Seller Balances", function () {
            it('correct eth balance change', async function () {
                const ethTestValue = parseEther(knownValue.toString());
                const startEthBalance = await ethers.provider.getBalance(receiverAddress);
                const approveReceipt = await (await deadCoin.connect(receiverAccount).approve(DEX.address, ethTestValue)).wait();
                const receipt = await (await DEX.connect(receiverAccount).sellTokens(ethTestValue)).wait();
                const endEthBalance = await ethers.provider.getBalance(receiverAddress);

                // Annoying way to account for TX fees
                const approveFees = approveReceipt.effectiveGasPrice.mul(approveReceipt.cumulativeGasUsed);
                const gasFees = receipt.effectiveGasPrice.mul(receipt.cumulativeGasUsed).add(approveFees);
                const ethToReceive = ethTestValue.div(await DEX.TOKENS_PER_ETH());

                const dexFee = await DEX.calcFee(ethValue.div(await DEX.TOKENS_PER_ETH()));


                expect(endEthBalance).to.equal((startEthBalance).add(ethToReceive).sub(gasFees).sub(dexFee));
            });

            it('correct coin balance change', async function () {
                const startCoinBalance = await deadCoin.balanceOf(receiverAddress);
                await deadCoin.connect(receiverAccount).approve(DEX.address, ethValue);
                await DEX.connect(receiverAccount).sellTokens(ethValue);
                const endCoinBalance = await deadCoin.balanceOf(receiverAddress);

                expect(endCoinBalance).to.equal((startCoinBalance).sub(ethValue));
            });
        });

        it('correct event emitted', async function () {
            await deadCoin.connect(receiverAccount).approve(DEX.address, ethValue);
            console.log('made it past approval');
            const dexFee = await DEX.calcFee(ethValue.div(await DEX.TOKENS_PER_ETH()));
            console.log('got the dex fee: ', dexFee.toString());

            expect(DEX.connect(receiverAccount).sellTokens(ethValue)).to.emit(DEX, 'SellTokens').withArgs(receiverAddress, ethValue.div(await DEX.TOKENS_PER_ETH()).sub(dexFee), ethValue);
        });

    });
});
