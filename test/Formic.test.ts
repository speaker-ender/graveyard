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
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

// Constants
const MAX_TRANSFER_VALUE = 1000000;

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
        zeroValue = BigNumber.from(0);
        knownValue = BigNumber.from(1);
        randomValue = BigNumber.from(Math.floor(Math.random() * MAX_TRANSFER_VALUE));

        this.Formic = await ethers.getContractFactory("Formic");
    });

    beforeEach(async function () {
        const signers = await ethers.getSigners();
        senderAccount = signers[0];
        senderAddress = senderAccount.address;
        receiverAccount = signers[1];
        receiverAddress = receiverAccount.address;
        formic = (await deployContract(signers[0], FormicArtifact, [senderAddress])) as Formic;
        await formic.deployed();
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
});
