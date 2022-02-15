import * as React from "react"
import { useEffect, useState } from "react";
import { BigNumber } from "ethers";
import { useRef } from "react";
import { useDEXContract } from "hooks/contracts/dex.hooks";
import { useActiveConnectorContext } from "hooks/connector.hooks";
import { StyledSwapper } from "./swapper.styles";
import { DEXInterface } from "../../../../typechain-types/DEX";

const Swapper: React.FC = () => {
    const hooks = useActiveConnectorContext();
    const DEXContract = useDEXContract({ hooks: hooks });
    const account = hooks.useActiveAccount();
    const chainId = hooks.useActiveChainId();
    const stakeAmount = useRef<HTMLInputElement>(null!);
    const [stakedBalance, setStakedBalance] = useState<BigNumber>(null!);

    useEffect(() => {
        return () => {
        }
    }, [])

    return (
        <>
            {!!DEXContract &&
                <StyledSwapper>
                    {!!stakedBalance &&
                        <p>{`Staked Balance: ${stakedBalance.toBigInt().toLocaleString()} ETH`}</p>
                    }
                </StyledSwapper>
            }
        </>
    )
}

export default Swapper
