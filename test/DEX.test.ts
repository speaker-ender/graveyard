// test/DEX.test.js
import { expect } from 'chai';
import { BigNumber } from "ethers";
import "chai-bn";
import { ethers, deployments } from "hardhat";
import 'hardhat-deploy';
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
            await deadCoin.transfer(DEX.address, parseEther('100'));
        });

        describe("DEX Balances", function () {
            it('correct eth balance on buy', async function () {
                const startEthBalance = await ethers.provider.getBalance(DEX.address);
                await DEX.connect(receiverAccount).buyTokens({ value: parseEther('1') });
                const endEthBalance = await ethers.provider.getBalance(DEX.address);
                console.log('made it past first buy');

                expect(endEthBalance).to.equal((startEthBalance).add(parseEther('1')));
            });

            it('correct coin balance on buy', async function () {
                const startCoinBalance = await deadCoin.balanceOf(DEX.address);
                await DEX.connect(receiverAccount).buyTokens({ value: parseEther('1') });
                const endCoinBalance = await deadCoin.balanceOf(DEX.address);

                expect(endCoinBalance).to.equal((startCoinBalance).sub(parseEther('1').mul(await DEX.TOKENS_PER_ETH())));
            });
        });

        describe("Buyer Balances", function () {
            it('correct eth balance on buy', async function () {
                const startEthBalance = await ethers.provider.getBalance(receiverAddress);
                const receipt = await (await DEX.connect(receiverAccount).buyTokens({ value: parseEther('1') })).wait();
                const endEthBalance = await ethers.provider.getBalance(receiverAddress);

                // Annoying way to account for TX fees
                const totalCost = parseEther('1').add(receipt.cumulativeGasUsed.mul(receipt.effectiveGasPrice));

                expect(endEthBalance).to.equal((startEthBalance).sub(totalCost));
            });

            it('correct coin balance on buy', async function () {
                const startCoinBalance = await deadCoin.balanceOf(receiverAddress);
                await DEX.connect(receiverAccount).buyTokens({ value: parseEther('1') });
                const endCoinBalance = await deadCoin.balanceOf(receiverAddress);
                const fee = await DEX.calcFee(parseEther('1'));

                expect(endCoinBalance).to.equal((startCoinBalance).add(parseEther('1').mul(await DEX.TOKENS_PER_ETH())).sub(fee));
            });
        });

        it('correct event emitted on buy', async function () {
            expect(DEX.buyTokens({ value: parseEther('1') })).to.emit(DEX, 'BuyTokens').withArgs(senderAddress, parseEther('1'), parseEther('1').mul(await DEX.TOKENS_PER_ETH()));
        });

    });

    describe("sellTokens function", function () {
        beforeEach(async function () {
            await deadCoin.transfer(receiverAddress, parseEther('50'));
            await senderAccount.sendTransaction({ to: DEX.address, value: parseEther('4') })
        });


        describe("DEX Balances", function () {
            it('correct DEX eth balance on sell', async function () {
                const startEthBalance = await ethers.provider.getBalance(DEX.address);
                await deadCoin.connect(receiverAccount).approve(DEX.address, parseEther('1'));
                await DEX.connect(receiverAccount).sellTokens(parseEther('1'));
                const endEthBalance = await ethers.provider.getBalance(DEX.address);

                expect(endEthBalance).to.equal((startEthBalance).sub(parseEther('1').div(await DEX.TOKENS_PER_ETH())));
            });

            it('correct DEX coin balance on sell', async function () {
                const startCoinBalance = await deadCoin.balanceOf(DEX.address);
                await deadCoin.connect(receiverAccount).approve(DEX.address, parseEther('1'));
                await DEX.connect(receiverAccount).sellTokens(parseEther('1'));
                const endCoinBalance = await deadCoin.balanceOf(DEX.address);

                expect(endCoinBalance).to.equal((startCoinBalance).add(parseEther('1')));
            });
        });

        describe("Seller Balances", function () {
            it('correct eth balance on sell', async function () {
                const ethTestValue = parseEther(knownValue.toString());
                const startEthBalance = await ethers.provider.getBalance(receiverAddress);
                const approveReceipt = await (await deadCoin.connect(receiverAccount).approve(DEX.address, ethTestValue)).wait();
                const receipt = await (await DEX.connect(receiverAccount).sellTokens(ethTestValue)).wait();
                const endEthBalance = await ethers.provider.getBalance(receiverAddress);

                // Annoying way to account for TX fees
                const approveFees = approveReceipt.effectiveGasPrice.mul(approveReceipt.cumulativeGasUsed);
                const gasFees = receipt.effectiveGasPrice.mul(receipt.cumulativeGasUsed).add(approveFees);
                const ethToReceive = ethTestValue.div(await DEX.TOKENS_PER_ETH());

                expect(endEthBalance).to.equal((startEthBalance).add(ethToReceive).sub(gasFees));
            });

            it('correct coin balance on sell', async function () {
                const startCoinBalance = await deadCoin.balanceOf(receiverAddress);
                await deadCoin.connect(receiverAccount).approve(DEX.address, parseEther('1'));
                await DEX.connect(receiverAccount).sellTokens(parseEther('1'));
                const endCoinBalance = await deadCoin.balanceOf(receiverAddress);

                expect(endCoinBalance).to.equal((startCoinBalance).sub(parseEther('1')));
            });
        });

        it('correct event emitted on sell', async function () {
            await deadCoin.connect(receiverAccount).approve(DEX.address, parseEther('1'));

            expect(DEX.connect(receiverAccount).sellTokens(parseEther('1'))).to.emit(DEX, 'SellTokens').withArgs(receiverAddress, parseEther('1').div(await DEX.TOKENS_PER_ETH()), parseEther('1'));
        });

    });
});
