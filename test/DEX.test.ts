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
        await deployments.fixture(["DeadCoin"]);
        deadCoin = await ethers.getContract('DeadCoin');

        await deployments.fixture(["DEX"]);
        DEX = await ethers.getContract('DEX');

        await deadCoin.transfer(DEX.address, parseEther('100'));
    });

    it('correct eth balance on buy', async function () {
        const startEthBalance = await ethers.provider.getBalance(DEX.address);
        console.log(startEthBalance.toString());
        const receipt = await DEX.buyTokens({ value: knownValue });
        const endEthBalance = await ethers.provider.getBalance(DEX.address);

        expect(endEthBalance).to.equal((startEthBalance).sub(knownValue));
    });

    it('correct coin balance on buy', async function () {
        const startCoinBalance = await deadCoin.balanceOf(DEX.address);
        console.log(knownValue.toString());
        console.log(startCoinBalance.toString());
        console.log(knownValue < startCoinBalance);
        const receipt = await DEX.buyTokens({ value: knownValue });
        const endEthBalance = await ethers.provider.getBalance(DEX.address);


        expect(startCoinBalance).to.equal((endEthBalance).sub(knownValue.mul(DEX.TOKENS_PER_ETH.toString())));
    });

    it('correct event emitted on buy', async function () {
        expect(DEX.buyTokens({ value: knownValue })).to.emit(DEX, 'BuyTokens').withArgs(senderAddress, knownValue, knownValue.mul(DEX.TOKENS_PER_ETH.toString()));
    });
});
