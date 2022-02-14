import type { NextPage } from 'next'
import dynamic from 'next/dynamic';
const ContractFactory = dynamic(() => import('../components/contracts/contractFactory'), { ssr: false });


const Home: NextPage = () => {
  return (
    <div>
      <ContractFactory />
    </div>
  )
}

export default Home
