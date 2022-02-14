import { hooks, metaMask } from '../../connectors/metamask.connector';
import Wallet from "./wallet";

const MetaMaskWallet = () => <Wallet hooks={hooks} connector={metaMask} />

export default MetaMaskWallet
