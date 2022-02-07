import { Web3ReactHooks } from "@web3-react/core"
import * as DeadCoinLocal from '../../../../deployments/localhost/DeadCoin.json';
import { DeadCoin } from '../../../../typechain-types';
import { useContract } from "../../hooks/contract.hooks";

export const useDeadCoinContract = ({ hooks: { useChainId, useProvider, useWeb3React } }: { hooks: Web3ReactHooks }) => {
    const currentProvider = useProvider();
    const { library } = useWeb3React(currentProvider);

    return useContract(DeadCoinLocal.address, DeadCoinLocal.abi, library) as DeadCoin;
}
