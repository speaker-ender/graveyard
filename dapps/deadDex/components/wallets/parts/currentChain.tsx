import * as React from "react"
import { Web3ReactHooks } from "@web3-react/core"
import { Paragraph } from "../../../global/typography"


export const CurrentChain = ({ hooks: { useChainId } }: { hooks: Web3ReactHooks }) => {
    const chainId = useChainId()

    return <Paragraph>Chain Id: {chainId ? <b>{chainId}</b> : '-'}</Paragraph>
}