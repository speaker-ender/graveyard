import * as React from "react"
import { useMediumRareStakeContract } from "../../hooks/contracts/mediumRareStake.hooks";
import { Web3ReactHooks } from "@web3-react/core";
import { useCallback, useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { useRef } from "react";
import { ContractDetails } from "./parts/details";
import { FunctionFactory } from "./parts/functionFactory";

const MediumRareStakeContract: React.FC<{ hooks: Web3ReactHooks }> = (props) => {
    const mediumRareStakeContract = useMediumRareStakeContract({ hooks: props.hooks });
    const account = props.hooks.useAccount();
    const chainId = props.hooks.useChainId();
    const stakeAmount = useRef<HTMLInputElement>(null!);
    const [stakedBalance, setStakedBalance] = useState<BigNumber>(null!);


    const getBalance = async (account: string) => {
        const accountBalance = await (!!mediumRareStakeContract ? mediumRareStakeContract.balances(account) : BigNumber.from(0));
        const denom = BigNumber.from(Math.pow(10, 18).toString());
        return accountBalance.div(denom);
    }

    const updateBalance = useCallback(async (account: string) => {
        mediumRareStakeContract && setStakedBalance(await getBalance(account));
    }, [mediumRareStakeContract, stakedBalance, setStakedBalance]);

    const tryStake = useCallback(async (event: React.FormEvent) => {
        event.preventDefault();
        const amount = stakeAmount.current.value;

        const receipt = !!mediumRareStakeContract && await mediumRareStakeContract.stake({ value: ethers.utils.parseEther(amount) });

    }, [mediumRareStakeContract, stakeAmount, chainId]);

    useEffect(() => {
        account && updateBalance(account);
        return () => {
        }
    }, [account, mediumRareStakeContract])

    useEffect(() => {
        account && updateBalance(account);
        return () => {
        }
    }, [])

    return (
        <div>
            {!!mediumRareStakeContract &&
                <div>
                    <ContractDetails {...mediumRareStakeContract} showLockedEthValue={true} />

                    {!!stakedBalance &&
                        <p>{`Staked Balance: ${stakedBalance.toBigInt().toLocaleString()} ETH`}</p>
                    }
                    <FunctionFactory contract={mediumRareStakeContract} fragments={mediumRareStakeContract.interface.functions} />
                    <form onSubmit={(e) => tryStake(e)}>
                        <label htmlFor="stakeAmount">Stake Amount in ETH</label>
                        <input name="stakeAmount" type="number" ref={stakeAmount} />
                        <button type="submit">Stake</button>
                    </form>
                </div>
            }
        </div>
    )
}

export default MediumRareStakeContract
