import * as React from "react"
import { useDeadCoinContract } from "../hooks/useContracts";
import { Web3ReactHooks } from "@web3-react/core";
import { Suspense, useCallback, useEffect, useState } from "react";
import { BigNumber } from "ethers";

const Contracts: React.FC<{ hooks: Web3ReactHooks }> = (props) => {
    const deadCoinContract = useDeadCoinContract({ hooks: props.hooks });
    const account = props.hooks.useAccount();
    const [balance, setBalance] = useState<BigNumber>(null!);


    const getBalance = async (account: string) => {
        return await deadCoinContract.balanceOf(account);
    }

    const updateBalance = useCallback(async (account: string) => {
        setBalance(await getBalance(account));
    }, [balance, setBalance]);

    useEffect(() => {
        // updateContracts(useContract(DeadCoinAddress, DeadCoinABI, library));
        account && updateBalance(account);

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
                        <p>{`DeadCoin Balance: ${balance.toBigInt().toLocaleString()}`}</p>
                    }
                </div>
            }
        </div>
    )
}

export default Contracts
