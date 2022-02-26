import * as React from "react"
import { useCallback, useEffect, useState } from "react";
import { BigNumber } from "ethers";
import { useRef } from "react";
import { useDEXContract } from "hooks/contracts/dex.hooks";
import { useActiveConnectorContext } from "hooks/connector.hooks";
import { StyledSwapperInfo } from "./swapperInfo.styles";
import { DEX } from "../../../../../typechain-types/DEX";
import { useDeadCoinContract } from "hooks/contracts/deadCoin.hooks";
import { DeadCoin } from "../../../../../typechain-types";
import { Paragraph } from "global/typography";

interface ISwapperInfo {
    deadCoin: DeadCoin,
    DEXContract: DEX,
}

const SwapperInfo: React.FC<ISwapperInfo> = ({ deadCoin, DEXContract }) => {
    const hooks = useActiveConnectorContext();
    const activeProvider = hooks.useActiveProvider();
    const [stakedBalance, setStakedBalance] = useState<BigNumber>(BigNumber.from('0'));
    const [deadLiquidity, setDeadLiquidity] = useState<BigNumber>(BigNumber.from('0'));
    const [ethLiquidity, setEthLiquidity] = useState<BigNumber>(BigNumber.from('0'));

    const updateStakedBalance = useCallback((dex: DEX) => {
    }, [stakedBalance, setStakedBalance]);

    const updateEthLiquidity = useCallback(async (dex: DEX) => {
        const newEthLiquidity = activeProvider && await activeProvider.getBalance(dex.address);
        setEthLiquidity(newEthLiquidity || BigNumber.from(0));
    }, [ethLiquidity, setEthLiquidity]);

    const updateDeadLiquidity = useCallback(async (dex: DEX, dead: DeadCoin) => {
        const newDeadLiquidity = await dead.balanceOf(dex.address);
        setDeadLiquidity(newDeadLiquidity);
    }, [deadLiquidity, setDeadLiquidity]);

    const getContractInfo = useCallback(() => {
        updateDeadLiquidity(DEXContract, deadCoin);
        updateEthLiquidity(DEXContract);
    }, [DEXContract, deadCoin]);

    useEffect(() => {
        getContractInfo();

        return () => {
        }
    }, [DEXContract, deadCoin])

    return (
        <StyledSwapperInfo>
            <Paragraph>{`Eth Liquidity: ${ethLiquidity.toBigInt().toLocaleString()} ETH`}</Paragraph>
            <Paragraph>{`DEAD Liquidity: ${deadLiquidity.toBigInt().toLocaleString()} DEAD`}</Paragraph>
            <Paragraph>{`Staked Balance: ${stakedBalance.toBigInt().toLocaleString()} ETH`}</Paragraph>
        </StyledSwapperInfo>
    )
}

export default SwapperInfo
