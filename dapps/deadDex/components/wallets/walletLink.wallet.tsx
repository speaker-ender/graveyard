import { hooks, walletLink } from '../../connectors/walletLink.connector'
import Wallet from './wallet';

const WalletLinkWallet = () => <Wallet hooks={hooks} connector={walletLink} />

export default WalletLinkWallet;