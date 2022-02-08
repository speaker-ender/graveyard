import * as React from "react"
import { Web3ReactHooks } from "@web3-react/core"
import { MetaMask } from "@web3-react/metamask"
import { Connector } from "@web3-react/types"
import { StyledStatus } from "./status.styles"

const getName = (connector: Connector) => {
    if (connector instanceof MetaMask) {
        return 'MetaMask'
        // } else if (connector instanceof Magic) {
        //   return 'Magic (Experimental)'
        // } else if (connector instanceof MetaMask) {
        //   return 'MetaMask'
        // } else if (connector instanceof Network) {
        //   return 'Network'
        // } else if (connector instanceof WalletConnect) {
        //   return 'WalletConnect'
        // } else if (connector instanceof WalletLink) {
        //   return 'WalletLink'
    } else {
        return 'Unknown'
    }
}

export const Status = ({
    connector,
    hooks: { useChainId, useAccounts, useError },
}: {
    connector: Connector
    hooks: Web3ReactHooks
}) => {
    const chainId = useChainId()
    const accounts = useAccounts()
    const error = useError()

    const connected = Boolean(chainId && accounts)

    return (
        <StyledStatus>
            <b>{getName(connector)}</b>
            <br />
            {error ? (
                <>
                    🛑 {error.name ?? 'Error'}: {error.message}
                </>
            ) : connected ? (
                <>✅ Connected</>
            ) : (
                <>⚠️ Disconnected</>
            )}
        </StyledStatus>
    )
}