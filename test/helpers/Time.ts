import { ethers } from "hardhat";

export const wait = async (duration: number) => {
    return new Promise(
        resolve => { setTimeout(resolve, duration); }
    )
};

export const increaseBlockTime = async (seconds: number) => {
    await ethers.provider.send("evm_increaseTime", [seconds]);
    await ethers.provider.send("evm_mine", []);
}