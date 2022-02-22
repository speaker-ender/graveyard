import { Web3ReactHooks } from "@web3-react/core"
import { Web3ReactActiveHooks } from "hooks/connector.hooks";
import { DeadCoin } from '../../../../typechain-types';
import { useContract } from "../../hooks/contract.hooks";
import { loadContracts } from "./contracts.hooks";

export const useDeadCoinContract = ({ hooks: { useActiveChainId, useActiveProvider, useActiveWeb3React } }: { hooks: Web3ReactActiveHooks }) => {
    const currentProvider = useActiveProvider();
    const chainId = useActiveChainId();
    const { library } = useActiveWeb3React(currentProvider);

    const contracts = loadContracts(chainId);
    const DeadCoinLocal = contracts ? contracts['DeadCoin'] : undefined;

    return DeadCoinLocal ? useContract(DeadCoinLocal.address, DeadCoinLocal.abi, library) as DeadCoin : undefined;
}
