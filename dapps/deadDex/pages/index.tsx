import type { NextPage } from 'next'
import dynamic from 'next/dynamic'

const MetaMaskWallet = dynamic(() => import('../components/wallets/metamask.wallet'), { ssr: false })


const Home: NextPage = () => {
  return (
    <div >
      <MetaMaskWallet />
    </div>
  )
}

export default Home
