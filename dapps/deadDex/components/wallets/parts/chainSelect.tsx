import { Network } from "@web3-react/network";
import { WalletConnect } from "@web3-react/walletconnect";
import { useActiveConnectorContext } from "hooks/connector.hooks";
import * as React from "react"
import { useCallback } from "react";
import { FC } from "react";
import { CHAINS, getAddChainParameters, URLS } from "../../../../../chains";
import { StyledSelect } from "../../../global/input.styles";
import { StyledLabel } from "../../../global/typography";
import { StyledChainSelect } from "./chainSelect.styles";

interface IChainSelect {
    chainId?: number
    switchChain?: ((chainId: number) => Promise<void>) | undefined
    displayDefault?: boolean
}

const ChainSelect: FC<IChainSelect> = ({ chainId, switchChain, displayDefault }) => {
    const { useActiveChainId, updateSelectedChainId, selectedConnectorChainId, useActiveConnector } = useActiveConnectorContext();
    const activeChainId = useActiveChainId();
    const activeConnector = useActiveConnector();

    const tryUpdateActiveChain = useCallback(async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newChainId = Number(event.target.value)

        if (!switchChain) {
            updateSelectedChainId(newChainId)
            // if we're already connected to the desired chain, return
            if (newChainId === selectedConnectorChainId) return
            // if they want to connect to the default chain and we're already connected, return
            if (newChainId === -1 && selectedConnectorChainId !== undefined) return

            if (activeConnector instanceof WalletConnect || activeConnector instanceof Network) {
                await activeConnector.activate(newChainId === -1 ? undefined : newChainId)
            } else {
                await activeConnector.activate(newChainId === -1 ? undefined : getAddChainParameters(newChainId))
            }
        }

        !!switchChain && switchChain(newChainId);
    }, [updateSelectedChainId, selectedConnectorChainId, activeChainId, activeConnector]);

    return (
        <StyledChainSelect>
            <StyledLabel>Chain:</StyledLabel>
            <StyledSelect
                value={`${chainId || activeChainId}`}
                onChange={
                    (event) => tryUpdateActiveChain(event)
                }
            // disabled={!switchChain}
            >
                {displayDefault ? <option value={-1}>Default Chain</option> : null}
                {Object.keys(URLS).map((chainId) => (
                    <option key={chainId} value={chainId}>
                        {CHAINS[Number(chainId)].name}
                    </option>
                ))}
            </StyledSelect>
        </StyledChainSelect>
    )
}

export default ChainSelect
