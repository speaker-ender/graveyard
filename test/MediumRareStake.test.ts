// test/Formic.test.js
import { expect } from 'chai';
import { BigNumber } from "ethers";
import "chai-bn";
import { deployments, ethers } from "hardhat";
import { expectRevert } from "@openzeppelin/test-helpers";
import { MediumRareStake } from 'typechain-types';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { getAccounts, getTestValues } from './helpers/Setup';
import { increaseBlockTime } from './helpers/Time';
import { parseEther } from 'ethers/lib/utils';

// Constants
const MAX_SUPPLY = 50;

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
        it('correct contract balance on stake', async function () {
            const startBalance = await ethers.provider.getBalance(mediumRareStake.address);
            await mediumRareStake.stake({ value: knownValue });
            const endBalance = await ethers.provider.getBalance(mediumRareStake.address);

            expect(endBalance).to.equal((startBalance).add(knownValue));
        });

        it('correct staker balance on stake', async function () {
            const startBalance = await ethers.provider.getBalance(senderAddress);
            const receipt = await (await mediumRareStake.stake({ value: knownValue })).wait();
            const endBalance = await ethers.provider.getBalance(senderAddress);

            const totalCost = knownValue.add(receipt.cumulativeGasUsed.mul(receipt.effectiveGasPrice));

            expect(endBalance).to.equal((startBalance).sub(totalCost));
        });

        it('correct event emitted on stake', async function () {
            expect(mediumRareStake.stake({ value: knownValue })).to.emit(mediumRareStake, 'Stake').withArgs(senderAddress, knownValue);
        });
    });

    describe("Execute Function", function () {
        // Prob need timer
        it('Wait until deadline met', async function () {
            await expectRevert(
                mediumRareStake.execute(),
                'DeadlineNotMet',
            );
        });

        it('Threshold not met', async function () {
            await increaseBlockTime(60);
            await expect(mediumRareStake.execute())
                .to.emit(mediumRareStake, 'Execute')
                .withArgs(false);
        });

        it('Threshold met', async function () {
            await increaseBlockTime(60);
            await mediumRareStake.stake({ value: parseEther("1") });
            await expect(mediumRareStake.execute())
                .to.emit(mediumRareStake, 'Execute')
                .withArgs(true);
        });

        it('Already Complete', async function () {
            await increaseBlockTime(60);
            await mediumRareStake.stake({ value: parseEther("1") });
            await mediumRareStake.execute();

            await expectRevert(
                mediumRareStake.execute(),
                'Completed',
            );
        });
    });

    describe("Withdraw Function", function () {
        it('revert when not open for withdraw', async function () {
            await expectRevert(
                mediumRareStake.withdraw(senderAddress),
                'NotWithdrawable',
            );
        });

        it('Cannot withdraw because complete', async function () {
            await increaseBlockTime(60);
            await mediumRareStake.stake({ value: parseEther("1") });
            await mediumRareStake.execute();

            await expectRevert(
                mediumRareStake.withdraw(senderAddress),
                'Completed',
            );
        });

        it('successful withdraw when open', async function () {
            await increaseBlockTime(60);
            await mediumRareStake.stake({ value: parseEther("0.5") });
            await mediumRareStake.execute();

            await expect(mediumRareStake.withdraw(senderAddress))
                .to.emit(mediumRareStake, 'Withdraw')
                .withArgs(senderAddress, parseEther("0.5"));
        });
    });

    describe("timeLeft Function", function () {
    });

});
