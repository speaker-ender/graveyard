import * as React from "react"
import { CHAINS, URLS } from "../../../../../chains";
import { StyledSelect } from "../../../global/input.styles";
import { StyledLabel } from "../../../global/typography";

export const MetaMaskSelect = ({ chainId, setChainId }: { chainId: number; setChainId?: (chainId: number) => void }) => {
    return (
        <StyledLabel>
            Chain:{chainId + ' '}
            <StyledSelect
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
                <option value={-1}>Default Chain</option>
                {Object.keys(URLS).map((chainId) => (
                    <option key={chainId} value={chainId}>
                        {CHAINS[Number(chainId)].name}
                    </option>
                ))}
            </StyledSelect>
        </StyledLabel>
    )
}