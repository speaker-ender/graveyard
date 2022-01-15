// test/Pequeninos.test.js
import { expect } from 'chai';
import { BigNumber } from "ethers";
import "chai-bn";
import { deployments, ethers } from "hardhat";
import {
    constants,
    expectRevert,
} from "@openzeppelin/test-helpers";
import { deployContract } from 'ethereum-waffle';
import PequeninosArtifact from '../artifacts/contracts/Pequeninos.sol/Pequeninos.json'
import { Pequeninos } from 'typechain-types';
import { getAccounts, getTestValues } from './helpers/Setup';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

// Constants
const MAX_TRANSFER_VALUE = 1000000;

describe("Pequeninos", function () {
    // Let's override context later
    let pequeninos: Pequeninos;
    let zeroValue: BigNumber;
    let knownValue: BigNumber;
    let randomValue: BigNumber;
    let senderAddress: string;
    let senderAccount: SignerWithAddress;
    let receiverAddress: string;
    let receiverAccount: SignerWithAddress;

    before(async function () {
        ; ({ zeroValue, knownValue, randomValue } = await getTestValues(MAX_TRANSFER_VALUE));
        ; ({ senderAccount, senderAddress, receiverAccount, receiverAddress } = await getAccounts());
    });

    beforeEach(async function () {
        await deployments.fixture(["Pequeninos"]);
        pequeninos = await ethers.getContract('Pequeninos');
    });

    it('reverts when transferring tokens to the zero address', async function () {
        // await expectRevert(
        //     pequeninos.transfer(constants.ZERO_ADDRESS, knownValue, { from: sender }),
        //     'ERC20: transfer to the zero address',
        // );
    });
});
