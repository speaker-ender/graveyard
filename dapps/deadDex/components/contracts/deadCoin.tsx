import * as React from "react"
import { useDeadCoinContract } from "../../hooks/contracts/deadCoin.hooks";
import { Web3ReactHooks } from "@web3-react/core";
import { useCallback, useEffect, useState } from "react";
import { BigNumber } from "ethers";
import { ContractDetails } from "./parts/details";
import { FunctionFactory } from "./parts/functionFactory";
import { Web3ReactActiveHooks } from "hooks/connector.hooks";

const DeadCoinContract: React.FC<{ hooks: Web3ReactActiveHooks }> = (props) => {
    const deadCoinContract = useDeadCoinContract({ hooks: props.hooks });
    const account = props.hooks.useActiveAccount();
    const [balance, setBalance] = useState<BigNumber>(null!);
    const [symbol, setSymbol] = useState<string>(null!);
    // deadCoinContract.interface.functions["balanceOf(address)"].inputs

    const getBalance = async (account: string) => {
        const accountBalance = await (!!deadCoinContract ? deadCoinContract.balanceOf(account) : BigNumber.from(0));
        const coinDecimals = await (!!deadCoinContract ? deadCoinContract.decimals() : 0);
        const denom = BigNumber.from(Math.pow(10, coinDecimals).toString());
        return accountBalance.div(denom);
    }

    const updateBalance = useCallback(async (account: string) => {
        !!deadCoinContract && setBalance(await getBalance(account));
    }, [deadCoinContract, balance, setBalance]);

    const updateSymbol = useCallback(async () => {
        !!deadCoinContract && setSymbol(await deadCoinContract.symbol());
    }, [deadCoinContract, balance, setBalance]);

    useEffect(() => {
        account && updateBalance(account);
        updateSymbol();
        return () => {
        }
    }, [account, deadCoinContract])

    useEffect(() => {
        account && updateBalance(account);
        updateSymbol();
        return () => {
        }
    }, [])

    return (
        <div>
            {!!deadCoinContract &&
                <>
                    <ContractDetails {...deadCoinContract} showLockedEthValue={true} />
                    <div>
                        {!!balance &&
                            <p>{`Balance: ${balance.toBigInt().toLocaleString()} ${symbol}`}</p>
                        }
                    </div>
                    <FunctionFactory contract={deadCoinContract} fragments={deadCoinContract.interface.functions} />
                </>
            }
        </div>
    )
}

export default DeadCoinContract
