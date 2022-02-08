import { Contract } from "@ethersproject/contracts";
import { useMemo } from "react";
import { Web3Provider, JsonRpcSigner } from "@ethersproject/providers";
import { AddressZero } from '@ethersproject/constants';

export function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
    return library.getSigner(account).connectUnchecked()
}

export function getProviderOrSigner(library: Web3Provider, account?: string): Web3Provider | JsonRpcSigner {
    return account ? getSigner(library, account) : library
}


export const useContract = (address: string | undefined, ABI: any, library?: Web3Provider, account?: string): Contract | null => {

    return useMemo(() => {
        if (!address || address === AddressZero || !ABI || !library) return null
        try {
            return new Contract(address, ABI, getProviderOrSigner(library, account));
        } catch (error) {
            console.error('Failed to get contract', error)
            return null
        }
    }, [address, ABI, library])
}