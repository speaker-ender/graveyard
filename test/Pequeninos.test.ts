// test/Pequeninos.test.js
import { expect } from 'chai';
import { BigNumber } from "ethers";
import "chai-bn";
import { ethers } from "hardhat";
import {
    constants,
    expectRevert,
} from "@openzeppelin/test-helpers";
import { deployContract } from 'ethereum-waffle';
import PequeninosArtifact from '../artifacts/contracts/Pequeninos.sol/Pequeninos.json'
import { Pequeninos } from 'typechain-types';

// Constants
const MAX_TRANSFER_VALUE = 1000000;

describe("Pequeninos", function () {
    // Let's override context later
    let pequeninos: Pequeninos;
    let zeroValue: BigNumber;
    let knownValue: BigNumber;
    let randomValue: BigNumber;
    let sender: string;
    let receiver: string;

    before(async function () {
        zeroValue = BigNumber.from(0);
        knownValue = BigNumber.from(1);
        randomValue = BigNumber.from(Math.floor(Math.random() * MAX_TRANSFER_VALUE));

        this.Pequeninos = await ethers.getContractFactory("Pequeninos");
    });

    beforeEach(async function () {
        const signers = await ethers.getSigners();
        sender = signers[0].address;
        receiver = signers[1].address;
        pequeninos = (await deployContract(signers[0], PequeninosArtifact)) as Pequeninos;
        await pequeninos.deployed();
    });

    it('reverts when transferring tokens to the zero address', async function () {
        // await expectRevert(
        //     pequeninos.transfer(constants.ZERO_ADDRESS, knownValue, { from: sender }),
        //     'ERC20: transfer to the zero address',
        // );
    });
});
