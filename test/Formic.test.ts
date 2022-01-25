// test/Formic.test.js
import { expect } from 'chai';
import { BigNumber } from "ethers";
import "chai-bn";
import { deployments, ethers } from "hardhat";
import {
    constants,
    expectRevert,
} from "@openzeppelin/test-helpers";
import { Formic } from 'typechain-types';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { getAccounts, getTestValues } from './helpers/Setup';

// Constants
const MAX_SUPPLY = 50;
const NUMBER_OF_RANDOM_TESTS = 5;
const VALID_IDS = [...Array(MAX_SUPPLY).keys()];

describe("Formic", function () {
    // Let's override context later
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
        await deployments.fixture(["Formic"]);
        formic = await ethers.getContract('Formic');
    });

    it('reverts when minting tokens to the zero address', async function () {
        await expectRevert(
            formic.mintTo(constants.ZERO_ADDRESS),
            'ERC721: mint to the zero address',
        );
    });

    it('emits transfer event on successful mint', async function () {
        const nextTokenId = (await formic.totalSupply()).add(1);
        await expect(formic.mintTo(senderAddress))
            .to.emit(formic, 'Transfer')
            .withArgs(constants.ZERO_ADDRESS, senderAddress, nextTokenId);
    });

    it('reverts when non admin tries to mint', async function () {
        await expectRevert(
            formic.connect(receiverAccount).mintTo(senderAddress),
            'Ownable: caller is not the owner',
        );
    });

    describe("receives correct uri for token", function () {
        // Use for more thorough testing
        // const randomTests = [...Array(randomValue.toNumber()).keys()];

        [...Array(NUMBER_OF_RANDOM_TESTS).keys()].forEach((i) => {
            it(`received correct token uri for id ${i}`, async function () {
                const response = await formic.mintTo(senderAddress);
                expect(await (formic.tokenURI(response.value)))
                    .to.equal(`https://formic.club/${response.value.toString()}`);
            });
        });
    });
});
