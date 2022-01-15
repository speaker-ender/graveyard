import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "tsconfig-paths/register";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-web3";
import "hardhat-gas-reporter";
import "hardhat-deploy";
import "solidity-coverage";

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
    },
    ropsten: {
      url: process.env.ROPSTEN_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    matic: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    arbitrum: {
      url: 'https://rinkeby.arbitrum.io/rpc',
    },
    arbl1: {
      gas: 2100000,
      url: process.env['L1RPC'] || '',
      accounts: process.env['DEVNET_PRIVKEY'] ? [process.env['DEVNET_PRIVKEY']] : [],

    },
    arbl2: {
      url: process.env['L2RPC'] || '',
      accounts: process.env['DEVNET_PRIVKEY'] ? [process.env['DEVNET_PRIVKEY']] : [],
    },
  },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
      1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
      "ropsten": process.env.MAIN_ADDRESS || '',
      "matic": process.env.MAIN_ADDRESS || '', // but for rinkeby it will be a specific address
    },
    user: {
      default: 1, // here this will by default take the second account as feeCollector (so in the test this will be a different account than the deployer)
      "ropsten": process.env.SECONDARY_ADDRESS || '',
      "matic": process.env.SECONDARY_ADDRESS || '', // but for rinkeby it will be a specific address
    }
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  }
};

export default config;
