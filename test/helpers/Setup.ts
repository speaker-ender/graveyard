// test/DeadCoin.test.js
import { BigNumber } from "ethers";
import "chai-bn";
import { ethers, getNamedAccounts } from "hardhat";
import hre from 'hardhat'
import { deployContract } from 'ethereum-waffle';
import * as dotenv from "dotenv";
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { parseEther } from 'ethers/lib/utils';

dotenv.config();

export const getNetworkName = () => hre.network.name;

export const isHardhat = () => getNetworkName() === 'hardhat';

export const getAccounts = async () => {
    const { deployer, user } = await getNamedAccounts();

    return {
        senderAccount: await ethers.getSigner(deployer),
        senderAddress: deployer,
        receiverAccount: await ethers.getSigner(user),
        receiverAddress: user
    }
}

export const getTestValues = (maxRandomValue: number) => {
    return {
        zeroValue: BigNumber.from(0),
        knownValue: BigNumber.from(1),
        ethValue: parseEther('1'),
        randomValue: BigNumber.from(Math.floor(Math.random() * maxRandomValue)),
    }
}

export const getContract = async (senderAccount: SignerWithAddress, artifact: any) => {
    await isHardhat ? deployContract(senderAccount, artifact) :
        await deployContract(senderAccount, artifact);
}
