import { Web3ReactHooks } from "@web3-react/core"
import { MediumRareStake } from '../../../../typechain-types';
import { useContract } from "../../hooks/contract.hooks";
import { loadContracts } from "./contracts.hooks";

export const useMediumRareStakeContract = ({ hooks: { useChainId, useProvider, useWeb3React } }: { hooks: Web3ReactHooks }) => {
    const currentProvider = useProvider();
    const chainId = useChainId();
    const { library, account } = useWeb3React(currentProvider);

    const contracts = loadContracts(chainId);
    const MediumRareStakeLocal = contracts ? contracts['MediumRareStake'] : undefined;

    return MediumRareStakeLocal ? useContract(MediumRareStakeLocal.address, MediumRareStakeLocal.abi, library, account) as MediumRareStake : undefined;
}
