import { Web3ReactHooks } from "@web3-react/core"
import { Web3ReactActiveHooks } from "hooks/connector.hooks";
import { DEX } from '../../../../typechain-types';
import { useContract } from "../../hooks/contract.hooks";
import { loadContracts } from "./contracts.hooks";

export const useDEXContract = ({ hooks: { useActiveChainId, useActiveProvider, useActiveWeb3React } }: { hooks: Web3ReactActiveHooks }) => {
    const currentProvider = useActiveProvider();
    const chainId = useActiveChainId();
    const { library, account } = useActiveWeb3React(currentProvider);

    const contracts = loadContracts(chainId);
    const DEXLocal = contracts ? contracts['DEX'] : undefined;

    return DEXLocal ? useContract(DEXLocal.address, DEXLocal.abi, library, account) as DEX : undefined;
}
