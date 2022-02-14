import { hooks, walletConnect } from '../../connectors/walletConnect.connector';
import Wallet from "./wallet";

const WalletConnectWallet = () => <Wallet hooks={hooks} connector={walletConnect} />

export default WalletConnectWallet

