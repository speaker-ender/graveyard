// test/DEX.test.js
import { expect } from 'chai';
import { BigNumber } from "ethers";
import "chai-bn";
import { ethers } from "hardhat";
import 'hardhat-deploy';
import { DeadCoin, DEX, MediumRareStake } from 'typechain-types';
import * as dotenv from "dotenv";
import { getAccounts, getTestValues } from '../helpers/Setup';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { parseEther } from 'ethers/lib/utils';
import { getBalance } from '../helpers/Balances';
import { calcGasFees, getContracts } from './helpers';

dotenv.config();

// Constants
const MAX_TRANSFER_VALUE = 1000000;

describe("DEX buyTokens()", function () {
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
        ; ({ DEX, deadCoin, mediumRareStake } = await getContracts(senderAccount, receiverAddress));

        await deadCoin.transfer(DEX.address, parseEther('100'));
    });

    describe("Eth Balance Changes", function () {

        it('DEX change', async function () {
            // Set Start Balance
            const startBalance = await getBalance(DEX.address);

            // Actions To Be Tested
            await DEX.connect(receiverAccount).buyTokens({ value: ethValue });

            // Set End Results
            const endBalance = await getBalance(DEX.address);
            const expectedChange = ethValue;

            expect(endBalance).to.equal((startBalance).add(expectedChange));
        });

        it('Seller change', async function () {
            // Set Start Balance
            const startBalance = await ethers.provider.getBalance(receiverAddress);

            // Actions To Be Tested
            const buyReceipt = await (await DEX.connect(receiverAccount).buyTokens({ value: ethValue })).wait();

            // Get All Fees
            const buyFees = calcGasFees(buyReceipt);

            // Set End Results
            const endBalance = await ethers.provider.getBalance(receiverAddress);
            const expectedChange = ethValue.add(buyFees).mul('-1');

            expect(endBalance).to.equal((startBalance).add(expectedChange));
        });
    });

    describe("Coin Balance Changes", function () {

        it('DEX change', async function () {
            // Set Start Balance
            const startBalance = await deadCoin.balanceOf(DEX.address);

            // Actions To Be Tested
            await DEX.connect(receiverAccount).buyTokens({ value: ethValue });

            // Set End Results
            const endBalance = await deadCoin.balanceOf(DEX.address);
            const expectedChange = ethValue.mul(await DEX.TOKENS_PER_ETH()).mul('-1');

            expect(endBalance).to.equal((startBalance).add(expectedChange));
        });

        it('Seller change', async function () {
            // Set Start Balance
            const startBalance = await deadCoin.balanceOf(receiverAddress);

            // Actions To Be Tested
            await DEX.connect(receiverAccount).buyTokens({ value: ethValue });
            const dexFee = await DEX.calcFee(ethValue);

            // Set End Results
            const endBalance = await deadCoin.balanceOf(receiverAddress);
            const expectedChange = ethValue.mul(await DEX.TOKENS_PER_ETH()).sub(dexFee);


            expect(endBalance).to.equal((startBalance).add(expectedChange));
        });
    });

    it('correct event emitted', async function () {
        const dexFee = await DEX.calcFee(ethValue);

        expect(DEX.buyTokens({ value: ethValue })).to.emit(DEX, 'BuyTokens').withArgs(senderAddress, ethValue, ethValue.mul(await DEX.TOKENS_PER_ETH()).sub(dexFee));
    });
});
