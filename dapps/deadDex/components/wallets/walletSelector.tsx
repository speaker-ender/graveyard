import Drawer from 'components/drawer'
import { Connectors, getConnectorName } from 'connectors/connectors'
import { useActiveConnectorContext } from 'hooks/connector.hooks'
import { FC } from 'react'
import { StyledButton } from '../../global/button.styles'
import ConnectButton from './parts/connectButton'
import { StyledWalletSelector, StyledWalletSelectorOption, StyledWalletSelectorTitle, StyledWalletSelectorWrapper } from './walletSelector.styles'

interface IWalletSelector {
}

const WalletSelector: FC<IWalletSelector> = () => {
    const { updateActiveConnectorName, activeConnectorName, useActiveConnector, selectedConnectorChainId, useActiveAccount } = useActiveConnectorContext();
    const activeConnector = useActiveConnector();
    const account = useActiveAccount();
    // const selectedConnectorName = getConnectorName(activeConnector);

    return (
        <StyledWalletSelectorWrapper>
            <Drawer title={activeConnectorName ? `🧧: ${activeConnectorName} ${account}` : 'Connect Wallet'}>
                <StyledWalletSelector>
                    {Object.entries(Connectors).map(([key, [connector, hooks]], index) => {
                        const name = getConnectorName(connector);
                        const isActiveConnector = name === activeConnectorName;
                        const isActive = hooks.useIsActive();

                        return (
                            <StyledWalletSelectorOption key={index}>
                                <StyledWalletSelectorTitle>{name}</StyledWalletSelectorTitle>
                                {!!isActiveConnector &&
                                    <div>🟢</div>
                                }
                                {(!!isActive && !isActiveConnector) &&
                                    <StyledButton onClick={() => !!updateActiveConnectorName && updateActiveConnectorName(name)}>Set Active</StyledButton>
                                }
                                <ConnectButton hooks={hooks} connector={connector} selectedChainId={selectedConnectorChainId} />
                            </StyledWalletSelectorOption>
                        )
                    })}
                </StyledWalletSelector>
            </Drawer>
        </StyledWalletSelectorWrapper>
    )
}

export default WalletSelector
