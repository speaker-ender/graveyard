import { ethers } from "hardhat"
import { ERC20 } from "typechain-types"


export const getBalance = async (address: string, coin?: ERC20) => !!coin ? await coin.balanceOf(address) : await ethers.provider.getBalance(address);

// export const getBalanceChange = async (fn: () => Promise<void>, address: string, coin?: ERC20) => {
//     const startBalance = await getBalance(address, coin);
//     await fn();
//     const endBalance = await getBalance(address, coin);
//     const balanceChange = endBalance.sub(startBalance.toString());

//     return [
//         startBalance,
//         endBalance,
//         balanceChange
//     ]
// }