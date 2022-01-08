// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import { Formic, FormicFactory, ProxyRegistry } from 'typechain-types';

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // OpenSea proxy registry addresses for rinkeby and mainnet.
  const signers = await ethers.getSigners();
  const zeroAddress = signers[0].address;

  // let proxyRegistryAddress = zeroAddress;

  // DeadCoin
  const DeadCoin = await ethers.getContractFactory("DeadCoin");
  const deadCoin = await DeadCoin.deploy();

  await deadCoin.deployed();

  console.log("DeadCoin deployed to:", deadCoin.address);

  const ProxyRegistry = await ethers.getContractFactory("contracts/skeletons/opensea/ERC721Tradable.sol:ProxyRegistry");
  const proxyRegistry = await ProxyRegistry.deploy() as ProxyRegistry;

  await proxyRegistry.deployed();

  const Formic = await ethers.getContractFactory("Formic");
  const formic = await Formic.deploy(proxyRegistry.address) as Formic;

  await formic.deployed();

  console.log("Formic deployed to:", formic.address);

  const FormicFactory = await ethers.getContractFactory("FormicFactory");
  // console.log(FormicFactory);
  const formicFactory = await FormicFactory.deploy(proxyRegistry.address, formic.address) as FormicFactory;

  await formicFactory.deployed();

  await formic.transferOwnership(formicFactory.address);

  console.log("FormicFactory deployed to:", formicFactory.address);

  const Pequeninos = await ethers.getContractFactory("Pequeninos");
  const pequeninos = await Pequeninos.deploy();

  await pequeninos.deployed();

  console.log("Pequeninos deployed to:", pequeninos.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
