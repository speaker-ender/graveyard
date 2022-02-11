import type { NextPage } from 'next'
import dynamic from 'next/dynamic'

const MetaMaskWallet = dynamic(() => import('../components/wallets/metamask.wallet'), { ssr: false });
const WalletConnectWallet = dynamic(() => import('../components/wallets/walletConnect.wallet'), { ssr: false });
const WalletLinkWallet = dynamic(() => import('../components/wallets/walletLink.wallet'), { ssr: false });


const Home: NextPage = () => {
  return (
    <div >
      <MetaMaskWallet />
      <WalletConnectWallet />
      <WalletLinkWallet />
    </div>
  )
}

export default Home
