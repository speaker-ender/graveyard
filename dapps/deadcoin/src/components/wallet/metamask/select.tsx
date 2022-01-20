import * as React from "react"
import { CHAINS, URLS } from "../../../../../../chains"

export const MetaMaskSelect = ({ chainId, setChainId }: { chainId: number; setChainId?: (chainId: number) => void }) => {
    return (
        <label>
            Chain:{' '}
            <select
                value={`${chainId}`}
                onChange={
                    setChainId
                        ? (event) => {
                            setChainId(Number(event.target.value))
                        }
                        : undefined
                }
                disabled={!setChainId}
            >
                <option value={-1}>Default</option>
                {Object.keys(URLS).map((chainId) => (
                    <option key={chainId} value={chainId}>
                        {CHAINS[Number(chainId)].name}
                    </option>
                ))}
            </select>
        </label>
    )
}