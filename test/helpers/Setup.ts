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

dotenv.config()

export const getAccounts = async () => {
    const networkName = hre.network.name;

    if (!!process.env.MAIN_ADDRESS && !!process.env.SECONDARY_ADDRESS && networkName !== 'hardhat') {
        return {
            senderAccount: await ethers.getSigner(process.env.MAIN_ADDRESS),
            senderAddress: process.env.MAIN_ADDRESS || "",
            receiverAccount: await ethers.getSigner(process.env.SECONDARY_ADDRESS),
            receiverAddress: process.env.SECONDARY_ADDRESS || ""
        }
    } else {
        const signers = await ethers.getSigners();
        return {
            senderAccount: signers[0],
            senderAddress: signers[0].address,
            receiverAccount: signers[1],
            receiverAddress: signers[1].address
        }
    }
}

export const getTestValues = (maxRandomValue: number) => {
    return {
        zeroValue: BigNumber.from(0),
        knownValue: BigNumber.from(1),
        randomValue: BigNumber.from(Math.floor(Math.random() * maxRandomValue))
    }
}
