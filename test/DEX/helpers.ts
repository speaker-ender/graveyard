import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber, ContractReceipt } from "ethers";
import { deployments, ethers } from "hardhat";
import { DeadCoin, DEX, MediumRareStake } from "typechain-types";

interface IDEXContext extends Mocha.Context {
    deadCoin: DeadCoin
    mediumRareStake: MediumRareStake;
    DEX: DEX;
    zeroValue: BigNumber;
    knownValue: BigNumber;
    ethValue: BigNumber;
    randomValue: BigNumber;
    senderAddress: string;
    senderAccount: SignerWithAddress;
    receiverAddress: string;
    receiverAccount: SignerWithAddress;
}

export const getContracts = async (senderAccount: SignerWithAddress, receiverAddress: string) => {
    await deployments.fixture(["DEX"]);
    const DEX: DEX = await ethers.getContract('DEX');
    const deadCoin: DeadCoin = await ethers.getContract('DeadCoin');
    const mediumRareStake: MediumRareStake = await ethers.getContract('MediumRareStake');

    return {
        DEX: DEX,
        deadCoin: deadCoin,
        mediumRareStake: mediumRareStake,
    }
}

export const calcGasFees = (receipt: ContractReceipt) => receipt.effectiveGasPrice.mul(receipt.cumulativeGasUsed);
