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
const MAX_TRANSFER_VALUE = 1000000;

describe.only("FormicFactory", function () {
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
        randomValue = BigNumber.from(Math.floor(Math.random() * MAX_TRANSFER_VALUE));

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
        // await expectRevert(
        //     formicFactory.mintTo(constants.ZERO_ADDRESS),
        //     'ERC721: mint to the zero address',
        // );
    });

    it('emits transfer event on successful mint', async function () {
        // const nextTokenId = (await formicFactory. .totalSupply()).add(1);
        console.log('Formic contract owner address', await formic.owner());
        console.log('FormicFactory contract owner address', await formicFactory.owner());
        console.log('FormicFactory contract address', formicFactory.address);
        console.log('sender address', senderAddress);
        await expect(formicFactory["mint(uint256,address)"](BigNumber.from(1), senderAddress))
            .to.emit(formicFactory, 'Transfer')
            .withArgs(constants.ZERO_ADDRESS, senderAddress);
    });

    it('reverts when non admin tries to mint', async function () {
        await expectRevert(
            formicFactory.connect(receiverAccount)["mint(uint256,address)"](BigNumber.from(1), senderAddress),
            'Transaction reverted: function call to a non-contract account',
        );
    });

    it('reverts when minting more than total supply', async function () {
        await expectRevert(
            formicFactory["mint(uint256,address,uint256)"](BigNumber.from(1), senderAddress, BigNumber.from(1001)),
            'Ownable: caller is not the owner',
        );
    });
});
