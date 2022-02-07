// test/FormicFactory.test.js
import { expect } from 'chai';
import { BigNumber } from "ethers";
import "chai-bn";
import { deployments, ethers } from "hardhat";
import {
    constants,
    expectRevert,
} from "@openzeppelin/test-helpers";
import { Formic, FormicFactory } from 'typechain-types';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { getAccounts, getTestValues } from './helpers/Setup';

// Constants
const MAX_SUPPLY = 50;

describe("FormicFactory", function () {
    // Let's override context later
    let formicFactory: FormicFactory;
    let formic: Formic;
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
        await deployments.fixture(["FormicFactory"]);
        formicFactory = await ethers.getContract('FormicFactory');
        formic = await ethers.getContract('Formic');
    });

    it('reverts when minting tokens to the zero address', async function () {
        await expectRevert(
            formicFactory["mint(address)"](constants.ZERO_ADDRESS),
            'ERC721: mint to the zero address',
        );
    });

    it('emits transfer event on successful mint', async function () {
        const endTokenId = (await formic.totalSupply()).add(knownValue);

        await expect(formicFactory["mint(address)"](senderAddress))
            .to.emit(formic, 'Transfer')
            .withArgs(constants.ZERO_ADDRESS, senderAddress, endTokenId);
    });

    it('reverts when non admin tries to mint', async function () {

        await expectRevert(
            formicFactory.connect(receiverAccount)["mint(address)"](receiverAddress),
            'reverted with panic code 0x1 (Assertion error)',
        );
    });

    it('reverts when minting more than total supply', async function () {

        await expectRevert(
            formicFactory["mint(address,uint256)"](senderAddress, BigNumber.from(51)),
            'FormicFactory: mint count more than available',
        );
    });

    it('transfer ownership properly', async function () {
        await expect(formicFactory.transferOwnership(receiverAddress))
            .to.emit(formicFactory, 'Transfer')
            .withArgs(senderAddress, receiverAddress, BigNumber.from(0));
    });

    it('reverts when trying to transfer from non owner', async function () {
        await expectRevert(
            formicFactory.connect(receiverAccount).transferOwnership(receiverAddress),
            'Ownable: caller is not the owner',
        );
    });
});
