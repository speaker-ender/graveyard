import * as React from "react"
import { Web3ReactHooks } from "@web3-react/core"

export const contractLoader = ({ hooks: { useChainId } }: { hooks: Web3ReactHooks }) => {
    const chainId = useChainId()



    return <div>Chain Id: {chainId ? <b>{chainId}</b> : '-'}</div>
}