// test/DeadCoin.test.js
import { expect } from 'chai';
import { BigNumber } from "ethers";
import "chai-bn";
import { ethers } from "hardhat";
import hre from 'hardhat'
import {
    constants,
    expectRevert,
} from "@openzeppelin/test-helpers";
import { deployContract } from 'ethereum-waffle';
import * as dotenv from "dotenv";
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

dotenv.config();

export const getNetworkName = () => hre.network.name;

export const isHardhat = () => getNetworkName() === 'hardhat';

export const getAccounts = async () => {
    const signers = await ethers.getSigners();

    return !!process.env.MAIN_ADDRESS && !!process.env.SECONDARY_ADDRESS && !isHardhat() ?
        {
            senderAccount: await ethers.getSigner(process.env.MAIN_ADDRESS),
            senderAddress: process.env.MAIN_ADDRESS || "",
            receiverAccount: await ethers.getSigner(process.env.SECONDARY_ADDRESS),
            receiverAddress: process.env.SECONDARY_ADDRESS || ""
        }
        :
        {
            senderAccount: signers[0],
            senderAddress: signers[0].address,
            receiverAccount: signers[1],
            receiverAddress: signers[1].address
        }
}

export const getTestValues = (maxRandomValue: number) => {
    return {
        zeroValue: BigNumber.from(0),
        knownValue: BigNumber.from(1),
        randomValue: BigNumber.from(Math.floor(Math.random() * maxRandomValue))
    }
}

export const getContract = async (senderAccount: SignerWithAddress, artifact: any) => {
    await isHardhat ? deployContract(senderAccount, artifact) :
        await deployContract(senderAccount, artifact);
}
