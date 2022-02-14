import { Deployment } from 'hardhat-deploy/types';
import * as Contracts from '../../../../deployments/deployments.json';
import { CHAINS } from "../../../../chains";
import { Web3ReactActiveHooks } from "hooks/connector.hooks";

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

interface IDeployments {
    [contractName: string]: Deployment
}

export const DEFAULT_CHAIN_ID = 31337;

export const loadContracts = (chainId?: number) => {
    const typedContracts = Contracts as IDeployedContracts;
    const contractsByChain = typedContracts[chainId || DEFAULT_CHAIN_ID];
    const chainName = CHAINS[chainId || DEFAULT_CHAIN_ID] ? CHAINS[chainId || DEFAULT_CHAIN_ID].name.toLowerCase() : undefined;

    if (!!contractsByChain && !!chainName) {
        const contracts = contractsByChain[chainName] ? contractsByChain[chainName].contracts : undefined;

        return contracts;
    }
}

export const useContracts = ({ hooks: { useActiveChainId } }: { hooks: Web3ReactActiveHooks }) => {
    const chainId = useActiveChainId();
    let contracts: IDeployments = {};

    const loadedContracts = loadContracts(chainId)

    for (const [key, value] of Object.entries(!!loadedContracts ? loadedContracts : {})) {
        contracts[key] = value;
    }

    return contracts;
}
