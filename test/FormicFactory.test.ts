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
import FormicFactoryArtifact from '../artifacts/contracts/FormicFactory.sol/FormicFactory.json'
import { Formic, FormicFactory, ProxyRegistry } from 'typechain-types';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

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
        zeroValue = BigNumber.from(0);
        knownValue = BigNumber.from(1);
        randomValue = BigNumber.from(Math.floor(Math.random() * MAX_SUPPLY));

        this.Formic = await ethers.getContractFactory("Formic");
        this.FormicFactory = await ethers.getContractFactory("FormicFactory");
        this.ProxyRegistry = await ethers.getContractFactory("contracts/skeletons/opensea/ERC721Tradable.sol:ProxyRegistry");
    });

    beforeEach(async function () {
        const signers = await ethers.getSigners();
        senderAccount = signers[0];
        senderAddress = senderAccount.address;
        receiverAccount = signers[1];
        receiverAddress = receiverAccount.address;

        const proxyRegistry = await this.ProxyRegistry.deploy() as ProxyRegistry;

        await proxyRegistry.deployed();

        formic = (await deployContract(signers[0], FormicArtifact, [proxyRegistry.address])) as Formic;
        await formic.deployed();

        formicFactory = (await deployContract(signers[0], FormicFactoryArtifact, [proxyRegistry.address, formic.address])) as FormicFactory;
        await formicFactory.deployed();

        await formic.transferOwnership(formicFactory.address);
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
            'FormicFactory: mint count greater than available supply',
        );
    });

    it('transfer ownership properly', async function () {
        await expect(formicFactory.transferOwnership(receiverAddress))
            .to.emit(formicFactory, 'Transfer')
            .withArgs(senderAddress, receiverAddress, BigNumber.from(0));
    });

    it('reverts when trying to transfer from non owner', async function () {

        await expectRevert(
            formicFactory.connect(receiverAddress).transferOwnership(receiverAddress),
            'Ownable: caller is not the owner',
        );
    });
});
