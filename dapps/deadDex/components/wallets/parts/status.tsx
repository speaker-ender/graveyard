import * as React from "react"
import { Web3ReactHooks } from "@web3-react/core"
import { Connector } from "@web3-react/types"
import { StyledStatus } from "./status.styles"
import { getConnectorName } from "connectors/connectors"

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
            <b>{getConnectorName(connector)}</b>
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