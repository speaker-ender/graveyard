import * as React from "react"
import { useDeadCoinContract } from "../../hooks/contracts/deadCoin.hooks";
import { Web3ReactHooks } from "@web3-react/core";
import { useCallback, useEffect, useState } from "react";
import { BigNumber } from "ethers";

const DeadCoinContract: React.FC<{ hooks: Web3ReactHooks }> = (props) => {
    const deadCoinContract = useDeadCoinContract({ hooks: props.hooks });
    const account = props.hooks.useAccount();
    const [balance, setBalance] = useState<BigNumber>(null!);
    const [symbol, setSymbol] = useState<string>(null!);


    const getBalance = async (account: string) => {
        const accountBalance = await deadCoinContract.balanceOf(account);
        const coinDecimals = await deadCoinContract.decimals();
        const denom = BigNumber.from(Math.pow(10, coinDecimals).toString());
        return accountBalance.div(denom);
    }

    const updateBalance = useCallback(async (account: string) => {
        setBalance(await getBalance(account));
    }, [balance, setBalance]);

    const updateSymbol = useCallback(async () => {
        setSymbol(await deadCoinContract.symbol());
    }, [balance, setBalance]);

    useEffect(() => {
        account && updateBalance(account);
        return () => {
        }
    }, [account])

    useEffect(() => {
        account && updateBalance(account);
        updateSymbol();
        return () => {
        }
    }, [])

    return (
        <div>
            <h3>DeadCoin Contract</h3>
            {!!deadCoinContract &&
                <div>
                    <h5>{`Contract Address: ${deadCoinContract.address}`}</h5>
                    {!!balance &&
                        <p>{`Balance: ${balance.toBigInt().toLocaleString()} ${symbol}`}</p>
                    }
                </div>
            }
        </div>
    )
}

export default DeadCoinContract
