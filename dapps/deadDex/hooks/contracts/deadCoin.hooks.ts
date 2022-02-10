import { Web3ReactHooks } from "@web3-react/core"
import { DeadCoin } from '../../../../typechain-types';
import { useContract } from "../../hooks/contract.hooks";
import { loadContracts } from "./contracts.hooks";

export const useDeadCoinContract = ({ hooks: { useChainId, useProvider, useWeb3React } }: { hooks: Web3ReactHooks }) => {
    const currentProvider = useProvider();
    const chainId = useChainId();
    const { library } = useWeb3React(currentProvider);

    const contracts = loadContracts(chainId);
    const DeadCoinLocal = contracts ? contracts['DeadCoin'] : undefined;

    return DeadCoinLocal ? useContract(DeadCoinLocal.address, DeadCoinLocal.abi, library) as DeadCoin : undefined;
}
