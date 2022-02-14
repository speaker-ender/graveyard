import Drawer from 'components/drawer'
import { Connectors, getConnectorName } from 'connectors/connectors'
import { useActiveConnectorContext } from 'hooks/connector.hooks'
import { FC } from 'react'
import { StyledButton } from '../../global/button.styles'
import { StyledWalletSelector, StyledWalletSelectorOption, StyledWalletSelectorTitle } from './walletSelector.styles'

interface IWalletSelector {
}

const WalletSelector: FC<IWalletSelector> = () => {
    const { updateActiveConnectorName, activeConnectorName, useActiveConnector } = useActiveConnectorContext();
    const activeConnector = useActiveConnector();

    return (
        <Drawer title={getConnectorName(activeConnector) || 'Select Wallet'}>
            <StyledWalletSelector>
                {Object.entries(Connectors).map(([key, value], index) => {
                    const name = getConnectorName(value[0]);
                    const isActiveConnector = value[0] === activeConnector;
                    const isActive = value[1].useIsActive();

                    return (
                        <StyledWalletSelectorOption key={index}>
                            <StyledWalletSelectorTitle>{name}</StyledWalletSelectorTitle>
                            {!isActiveConnector &&
                                <>
                                    {!!isActive ?
                                        <StyledButton onClick={() => !!updateActiveConnectorName && updateActiveConnectorName(name)}>Set Active</StyledButton>
                                        : <StyledButton onClick={() => !!updateActiveConnectorName && updateActiveConnectorName(name)}>Connect!</StyledButton>
                                    }
                                </>
                            }

                        </StyledWalletSelectorOption>
                    )
                })}
            </StyledWalletSelector>
        </Drawer>
    )
}

export default WalletSelector
