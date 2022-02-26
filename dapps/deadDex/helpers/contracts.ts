import { Deployment } from 'hardhat-deploy/types';
import * as Deployments from '../../../deployments/deployments.json';
import { CHAINS } from "../../../chains";

interface IDeployments {
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

export const DEFAULT_CHAIN_ID = 31337;


export const getChainsFromContractName = (contractName: string) => {
    let chainIds: number[] = [];
    const deployments = Deployments as IDeployments;

    Object.keys(deployments).map((value) => {
        const chainId = parseInt(value);
        const chainName = CHAINS[chainId || DEFAULT_CHAIN_ID] ? CHAINS[chainId || DEFAULT_CHAIN_ID].name.toLowerCase() : undefined;
        if (chainName) {
            const contracts = deployments[chainId][chainName] ? deployments[chainId][chainName].contracts : undefined;
            !!contracts && !!contracts[contractName] && chainIds.push(chainId);
        }
    });

    return chainIds;
}

export const getAddressFromNameAndChainId = (name: string, chainId: number) => {

}
