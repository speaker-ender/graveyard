// test/DEX.test.js
import { expect } from 'chai';
import { BigNumber } from "ethers";
import "chai-bn";
import { ethers } from "hardhat";
import 'hardhat-deploy';
import { expectRevert } from "@openzeppelin/test-helpers";
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
const DEX_LIQUIDITY = parseEther('100');

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
        ; ({ DEX, deadCoin, mediumRareStake } = await getContracts(senderAccount, receiverAddress));

        // Fund DEX
        await deadCoin.transfer(DEX.address, DEX_LIQUIDITY);
        await senderAccount.sendTransaction({ to: DEX.address, value: DEX_LIQUIDITY });

        // Fund Tester
        await deadCoin.transfer(receiverAddress, parseEther('500'));
    });

    it('Equal Fees for Buy and Sell', async function () {
        const startBalance = await deadCoin.balanceOf(mediumRareStake.address);

        // Sell Tokens worth 1 ETH
        const toSell = ethValue.mul(await DEX.TOKENS_PER_ETH());
        await deadCoin.connect(receiverAccount).approve(DEX.address, toSell);
        await DEX.connect(receiverAccount).sellTokens(toSell);

        const secondBalance = await deadCoin.balanceOf(mediumRareStake.address);

        // Buy Tokens worth 1 ETH
        await DEX.connect(receiverAccount).buyTokens({ value: ethValue });

        const endBalance = await deadCoin.balanceOf(mediumRareStake.address);

        const firstChange = secondBalance.sub(startBalance);
        const secondChange = endBalance.sub(secondBalance);

        expect(firstChange).to.equal(secondChange);
    });

});

