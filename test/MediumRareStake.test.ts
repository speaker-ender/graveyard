// test/Formic.test.js
import { expect } from 'chai';
import { BigNumber } from "ethers";
import "chai-bn";
import { deployments, ethers } from "hardhat";
import { expectRevert } from "@openzeppelin/test-helpers";
import { MediumRareStake } from 'typechain-types';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { getAccounts, getTestValues } from './helpers/Setup';

// Constants
const MAX_SUPPLY = 50;
const NUMBER_OF_RANDOM_TESTS = 5;
const VALID_IDS = [...Array(MAX_SUPPLY).keys()];

describe("MediumRareStake", function () {
    // Let's override context later
    let mediumRareStake: MediumRareStake;
    let zeroValue: BigNumber;
    let knownValue: BigNumber;
    let randomValue: BigNumber;
    let senderAddress: string;
    let senderAccount: SignerWithAddress;
    let receiverAddress: string;
    let receiverAccount: SignerWithAddress;

    before(async function () {
        ; ({ zeroValue, knownValue, randomValue } = getTestValues(MAX_SUPPLY));
        ; ({ senderAccount, senderAddress, receiverAccount, receiverAddress } = await getAccounts());
    });

    beforeEach(async function () {
        await deployments.fixture(["MediumRareStake"]);
        mediumRareStake = await ethers.getContract('MediumRareStake');
    });

    describe("Stake Function", function () {
        it('correct contract eth balance on buy', async function () {
            const startEthBalance = await ethers.provider.getBalance(mediumRareStake.address);
            await mediumRareStake.stake({ value: knownValue });
            const endEthBalance = await ethers.provider.getBalance(mediumRareStake.address);

            expect(endEthBalance).to.equal((startEthBalance).add(knownValue));
        });

        it('correct staker eth balance on buy', async function () {
            const startEthBalance = await ethers.provider.getBalance(senderAddress);
            const receipt = await (await mediumRareStake.stake({ value: knownValue })).wait();
            const endEthBalance = await ethers.provider.getBalance(senderAddress);

            const totalCost = knownValue.add(receipt.cumulativeGasUsed.mul(receipt.effectiveGasPrice));

            expect(endEthBalance).to.equal((startEthBalance).sub(totalCost));
        });

        it('correct event emitted on stake', async function () {
            expect(mediumRareStake.stake({ value: knownValue })).to.emit(mediumRareStake, 'Stake').withArgs(senderAddress, knownValue);
        });
    });

    describe("Withdraw Function", function () {
        it('revert when not open for withdraw', async function () {
            await expectRevert(
                mediumRareStake.withdraw(senderAddress),
                'NotWithdrawable',
            );
        });
    });
});
