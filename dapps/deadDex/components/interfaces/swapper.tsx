import * as React from "react"
import { useDEXContract } from "hooks/contracts/dex.hooks";
import { useActiveConnectorContext } from "hooks/connector.hooks";
import { StyledSwapper, StyledSwapperHeader } from "./swapper.styles";
import { useDeadCoinContract } from "hooks/contracts/deadCoin.hooks";
import SwapperInfo from "./parts/swapperInfo";

const Swapper: React.FC = () => {
    const hooks = useActiveConnectorContext();
    const DEXContract = useDEXContract({ hooks: hooks });
    const deadCoin = useDeadCoinContract({ hooks: hooks });

    return (
        <StyledSwapper>
            <StyledSwapperHeader>Swap</StyledSwapperHeader>
            {deadCoin && DEXContract &&
                <SwapperInfo deadCoin={deadCoin} DEXContract={DEXContract} />
            }
        </StyledSwapper>
    )
}

export default Swapper
