import * as React from "react"
import { Web3ReactHooks } from "@web3-react/core"
import { abi as DeadCoinABI, address as DeadCoinAddress } from '../../../../deployments/localhost/DeadCoin.json';
import { Contract } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { Web3Provider } from "@ethersproject/providers";
import { AddressZero } from '@ethersproject/constants';
import { DeadCoin } from '../../../../typechain-types';


// export const useActiveWeb3React = ({ hooks: { useWeb3React, useProvider } }: { hooks: Web3ReactHooks }) => {
//     const currentProvider = useProvider();
//     const context = useWeb3React(currentProvider)
//     return context;
// }


export const useContract = (address: string | undefined, ABI: any, library: Web3Provider): Contract | null => {

    return React.useMemo(() => {
        if (!address || address === AddressZero || !ABI || !library) return null
        try {
            return new Contract(address, ABI, library);
        } catch (error) {
            console.error('Failed to get contract', error)
            return null
        }
    }, [address, ABI, library])
}

export const useDeadCoinContract = ({ hooks: { useChainId, useProvider, useWeb3React } }: { hooks: Web3ReactHooks }) => {
    const currentProvider = useProvider();
    const { library, account } = useWeb3React(currentProvider);

    return useContract(DeadCoinAddress, DeadCoinABI, library) as DeadCoin;
}

export const useContracts = ({ hooks: { useChainId, useProvider, useWeb3React } }: { hooks: Web3ReactHooks }) => {
    const chainId = useChainId();
    const currentProvider = useProvider();
    const { library, account } = useWeb3React(currentProvider);
    const [contracts, setContracts] = useState<Contract[]>(null!);

    const updateContracts = useCallback((newContract: Contract) => {
        setContracts([...contracts, newContract]);
    }, [contracts, setContracts]);

    useEffect(() => {
        const newContract = useContract(DeadCoinAddress, DeadCoinABI, library);
        console.log(newContract);
        // updateContracts(useContract(DeadCoinAddress, DeadCoinABI, library));

        return () => {
        }
    }, [])

    return { contracts, updateContracts };
}
