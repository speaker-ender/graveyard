import * as React from "react"
import { Web3ReactHooks } from "@web3-react/core"
import { abi } from '../../../../deployments/localhost/DeadCoin.json';

export const contractLoader = ({ hooks: { useChainId } }: { hooks: Web3ReactHooks }) => {
    const chainId = useChainId()



    return <div>Chain Id: {chainId ? <b>{chainId}</b> : '-'}</div>
}