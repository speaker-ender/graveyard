import { Web3ReactHooks } from "@web3-react/core"
import * as MediumRareStakeLocal from '../../../../deployments/localhost/MediumRareStake.json';
import { MediumRareStake } from '../../../../typechain-types';
import { useContract } from "../../hooks/contract.hooks";

export const useMediumRareStakeContract = ({ hooks: { useChainId, useProvider, useWeb3React } }: { hooks: Web3ReactHooks }) => {
    const currentProvider = useProvider();
    const { library, account } = useWeb3React(currentProvider);

    return useContract(MediumRareStakeLocal.address, MediumRareStakeLocal.abi, library, account) as MediumRareStake;
}
