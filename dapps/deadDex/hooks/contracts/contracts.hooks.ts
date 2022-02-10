import { Web3ReactHooks } from "@web3-react/core"
import { useContract } from "../../hooks/contract.hooks";
import { Deployment } from 'hardhat-deploy/types';
import * as Contracts from '../../../../deployments/deployments.json';
import { CHAINS } from "../../../../chains";
import { Contract } from "@ethersproject/contracts";

interface IDeployedContracts {
    [chainId: number]: {
        [chainName: string]: {
            name: string;
            chainId: string,
            contracts: {
                [contractName: string]: Deployment;
            }
        }
    }
}

interface IContracts {
    [contractName: string]: Contract;
}

const DEFAULT_CHAIN_ID = 31337;

export const loadContracts = (chainId?: number) => {
    const typedContracts = Contracts as IDeployedContracts;

    return typedContracts[chainId || DEFAULT_CHAIN_ID][CHAINS[chainId || DEFAULT_CHAIN_ID].name.toLowerCase()].contracts;
}

export const useContracts = ({ hooks: { useChainId, useProvider, useWeb3React } }: { hooks: Web3ReactHooks }) => {
    const currentProvider = useProvider();
    const chainId = useChainId();
    const { library } = useWeb3React(currentProvider);
    let contracts: IContracts = {};

    const loadedContracts = loadContracts(chainId || DEFAULT_CHAIN_ID);

    for (const [key, value] of Object.entries(loadedContracts)) {
        const contract = useContract(value.address, value.abi, library);

        if (!!contract) {
            contracts[key] = contract
        }
    }

    return contracts;
}
