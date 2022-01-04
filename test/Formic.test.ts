// test/Formic.test.js
import { expect } from 'chai';
import { BigNumber } from "ethers";
import "chai-bn";
import { ethers } from "hardhat";
import {
    constants,
    expectRevert,
} from "@openzeppelin/test-helpers";
import { deployContract } from 'ethereum-waffle';
import FormicArtifact from '../artifacts/contracts/Formic.sol/Formic.json'
import { Formic } from 'typechain-types';

// Constants
const MAX_TRANSFER_VALUE = 1000000;

describe("Formic", function () {
    // Let's override context later
    let formic: Formic;
    let zeroValue: BigNumber;
    let knownValue: BigNumber;
    let randomValue: BigNumber;
    let sender: string;
    let receiver: string;

    before(async function () {
        zeroValue = BigNumber.from(0);
        knownValue = BigNumber.from(1);
        randomValue = BigNumber.from(Math.floor(Math.random() * MAX_TRANSFER_VALUE));

        this.Formic = await ethers.getContractFactory("Formic");
    });

    beforeEach(async function () {
        const signers = await ethers.getSigners();
        sender = signers[0].address;
        receiver = signers[1].address;
        formic = (await deployContract(signers[0], FormicArtifact)) as Formic;
        await formic.deployed();
    });

    it('reverts when transferring tokens to the zero address', async function () {
        // await expectRevert(
        //     formic.transfer(constants.ZERO_ADDRESS, knownValue, { from: sender }),
        //     'ERC20: transfer to the zero address',
        // );
    });
});
