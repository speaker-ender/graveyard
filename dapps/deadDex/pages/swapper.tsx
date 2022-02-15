import { Header2 } from 'global/typography';
import type { NextPage } from 'next'
import dynamic from 'next/dynamic';

const Swapper = dynamic(() => import('components/interfaces/swapper'), { ssr: false });


const SwapperPage: NextPage = () => {
    return (
        <div>
            <Swapper />
        </div>
    )
}

export default SwapperPage
