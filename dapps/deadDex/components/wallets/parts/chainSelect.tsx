import * as React from "react"
import { FC } from "react";
import { CHAINS, URLS } from "../../../../../chains";
import { StyledSelect } from "../../../global/input.styles";
import { StyledLabel } from "../../../global/typography";

interface IChainSelect {
    chainId: number
    switchChain: ((chainId: number) => Promise<void>) | undefined
    displayDefault: boolean
    chainIds: number[]
}

export const ChainSelect: FC<IChainSelect> = (props) => {
    return (
        <StyledLabel>
            Chain:{props.chainId + ' '}
            <StyledSelect
                value={`${props.chainId}`}
                onChange={
                    (event) => {
                        props.switchChain ? props.switchChain(Number(event.target.value)) : undefined;
                    }
                }
                disabled={!props.switchChain}
            >
                {props.displayDefault ? <option value={-1}>Default Chain</option> : null}
                {Object.keys(URLS).map((chainId) => (
                    <option key={chainId} value={chainId}>
                        {CHAINS[Number(chainId)].name}
                    </option>
                ))}
            </StyledSelect>
        </StyledLabel>
    )
}