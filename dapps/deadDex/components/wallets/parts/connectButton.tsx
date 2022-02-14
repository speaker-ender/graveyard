import type { Web3ReactHooks } from '@web3-react/core'
import type { MetaMask } from '@web3-react/metamask'
import { Network } from '@web3-react/network'
import { WalletConnect } from '@web3-react/walletconnect'
import type { WalletLink } from '@web3-react/walletlink'
import { getConnectorName } from 'connectors/connectors'
import { useActiveConnectorContext } from 'hooks/connector.hooks'
import { useEffect } from 'react'
import { FC } from 'react'
import { getAddChainParameters } from '../../../../../chains'
import { StyledButton } from '../../../global/button.styles'

interface IConnectButton {
    hooks: Web3ReactHooks,
    connector: MetaMask | WalletConnect | WalletLink | Network
    selectedChainId: number
}

const ConnectButton: FC<IConnectButton> = ({ hooks, connector, selectedChainId }) => {
    const { updateActiveConnectorName } = useActiveConnectorContext()
    const error = hooks.useError()
    const isActivating = hooks.useIsActivating()
    const isActive = hooks.useIsActive()

    const tryConnectWallet = () => {
        connector instanceof WalletConnect || connector instanceof Network
            ? connector.activate(selectedChainId === -1 ? undefined : selectedChainId)
            : connector.activate(selectedChainId === -1 ? undefined : getAddChainParameters(selectedChainId))
    }

    useEffect(() => {
        !!isActive && !!updateActiveConnectorName && updateActiveConnectorName(getConnectorName(connector))

        return () => {
        }
    }, [isActive])

    if (isActive) {
        return (
            <>
                <StyledButton onClick={() => {
                    !!connector.deactivate ? connector.deactivate() : undefined
                }}>Disconnect</StyledButton>
            </>
        )
    } else {
        return (
            <>
                <StyledButton
                    onClick={isActivating ? undefined : () => tryConnectWallet()
                    }
                    disabled={isActivating}
                >
                    {isActivating ? 'Connecting...' : error ? 'Try Again?' : 'Connect'}
                </StyledButton>
            </>
        )
    }
}

export default ConnectButton
