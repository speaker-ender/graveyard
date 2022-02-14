import { Web3ReactHooks } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';
import { Network } from '@web3-react/network';
import { Connector } from '@web3-react/types';
import { WalletConnect } from '@web3-react/walletconnect';
import { WalletLink } from '@web3-react/walletlink';
import { hooks as metaMaskHooks, metaMask } from './metamask.connector'
// import { hooks as networkHooks, network } from '../connectors/network.connector'
import { hooks as walletConnectHooks, walletConnect } from './walletConnect.connector'
import { hooks as walletLinkHooks, walletLink } from './walletLink.connector'

export type ConnectorName = 'MetaMask' | 'WalletConnect' | 'WalletLink' | 'Network' | "Unknown";
export type ConnectorTypes = MetaMask | WalletConnect | WalletLink | Network;

export const getConnectorName = (connector: Connector): ConnectorName => {
    if (connector instanceof MetaMask) return 'MetaMask'
    if (connector instanceof WalletConnect) return 'WalletConnect'
    if (connector instanceof WalletLink) return 'WalletLink'
    if (connector instanceof Network) return 'Network'

    return 'Unknown'
}


export const Connectors: [MetaMask | WalletConnect | WalletLink | Network, Web3ReactHooks][] = [
    [metaMask, metaMaskHooks],
    [walletConnect, walletConnectHooks],
    [walletLink, walletLinkHooks]
];