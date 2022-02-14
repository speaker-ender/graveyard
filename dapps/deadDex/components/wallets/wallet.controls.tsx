import type { Web3ReactHooks } from '@web3-react/core'
import type { MetaMask } from '@web3-react/metamask'
import { Network } from '@web3-react/network'
import { WalletConnect } from '@web3-react/walletconnect'
import type { WalletLink } from '@web3-react/walletlink'
import { FC } from 'react'
import { useCallback, useState } from 'react'
import { CHAINS, getAddChainParameters, URLS } from '../../../../chains'
import { StyledButton } from '../../global/button.styles'
import ChainSelect from './parts/chainSelect'

interface IWalletControls {
    hooks: Web3ReactHooks,
    connector: MetaMask | WalletConnect | WalletLink | Network
}

const WalletControls: FC<IWalletControls> = ({ hooks, connector }) => {
    const chainId = hooks.useChainId()
    const error = hooks.useError()
    const isActivating = hooks.useIsActivating()
    const isActive = hooks.useIsActive()
    const isNetwork = connector instanceof Network
    const displayDefault = false

    const [desiredChainId, setDesiredChainId] = useState<number>(isNetwork ? 1 : -1)

    const switchChain = useCallback(
        async (desiredChainId: number) => {
            setDesiredChainId(desiredChainId)
            // if we're already connected to the desired chain, return
            if (desiredChainId === chainId) return
            // if they want to connect to the default chain and we're already connected, return
            if (desiredChainId === -1 && chainId !== undefined) return

            if (connector instanceof WalletConnect || connector instanceof Network) {
                await connector.activate(desiredChainId === -1 ? undefined : desiredChainId)
            } else {
                await connector.activate(desiredChainId === -1 ? undefined : getAddChainParameters(desiredChainId))
            }
        },
        [connector, chainId]
    )

    if (error) {
        return (
            <>
                <ChainSelect chainId={desiredChainId}
                    switchChain={switchChain}
                    displayDefault={displayDefault} />
                <StyledButton
                    onClick={() =>
                        connector instanceof WalletConnect || connector instanceof Network
                            ? connector.activate(desiredChainId === -1 ? undefined : desiredChainId)
                            : connector.activate(desiredChainId === -1 ? undefined : getAddChainParameters(desiredChainId))
                    }
                >
                    Try Again?
                </StyledButton>
            </>
        )
    } else if (isActive) {
        return (
            <>
                {/* TODO: Fix chainID to make more sense */}
                {chainId &&
                    <ChainSelect chainId={chainId}
                        switchChain={switchChain}
                        displayDefault={displayDefault} />
                }
                <StyledButton onClick={() => {
                    console.log(connector);
                    !!connector.deactivate ? connector.deactivate() : undefined
                }}>Disconnect</StyledButton>
            </>
        )
    } else {
        return (
            <>
                <ChainSelect chainId={desiredChainId}
                    switchChain={isActivating ? undefined : switchChain}
                    displayDefault={displayDefault} />
                <StyledButton
                    onClick={
                        isActivating
                            ? undefined
                            : () =>
                                connector instanceof WalletConnect || connector instanceof Network
                                    ? connector.activate(desiredChainId === -1 ? undefined : desiredChainId)
                                    : connector.activate(desiredChainId === -1 ? undefined : getAddChainParameters(desiredChainId))
                    }
                    disabled={isActivating}
                >
                    {isActivating ? 'Connecting...' : 'Connect'}
                </StyledButton>
            </>
        )
    }
}

export default WalletControls
