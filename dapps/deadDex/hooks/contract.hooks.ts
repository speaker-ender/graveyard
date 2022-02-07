import { Contract } from "ethers";
import { useMemo } from "react";
import { Web3Provider } from "@ethersproject/providers";
import { AddressZero } from '@ethersproject/constants';


export const useContract = (address: string | undefined, ABI: any, library?: Web3Provider): Contract | null => {

    return useMemo(() => {
        if (!address || address === AddressZero || !ABI || !library) return null
        try {
            return new Contract(address, ABI, library);
        } catch (error) {
            console.error('Failed to get contract', error)
            return null
        }
    }, [address, ABI, library])
}