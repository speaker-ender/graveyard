import * as React from "react"
import { useMediumRareStakeContract } from "../../hooks/contracts/mediumRareStake.hooks";
import { Web3ReactHooks } from "@web3-react/core";
import { useCallback, useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { useRef } from "react";
// import { useDeadCoinContract } from "../../hooks/contracts/deadCoin.hooks";

const MediumRareStakeContract: React.FC<{ hooks: Web3ReactHooks }> = (props) => {
    const mediumRareStakeContract = useMediumRareStakeContract({ hooks: props.hooks });
    // const deadCoinContract = useDeadCoinContract({ hooks: props.hooks });
    const account = props.hooks.useAccount();
    const chainId = props.hooks.useChainId();
    const provider = props.hooks.useProvider();
    const stakeAmount = useRef<HTMLInputElement>(null!);
    const [stakedBalance, setStakedBalance] = useState<BigNumber>(null!);


    const getBalance = async (account: string) => {
        const accountBalance = await mediumRareStakeContract.balances(account);
        // const coinDecimals = await mediumRareStakeContract.decimals();
        const denom = BigNumber.from(Math.pow(10, 18).toString());
        return accountBalance.div(denom);
    }

    const updateBalance = useCallback(async (account: string) => {
        mediumRareStakeContract && setStakedBalance(await getBalance(account));
    }, [mediumRareStakeContract, stakedBalance, setStakedBalance]);

    const tryStake = useCallback(async (event: React.FormEvent) => {
        event.preventDefault();
        const amount = stakeAmount.current.value;
        console.log(amount);
        console.log(chainId);
        console.log(provider?.network);
        const receipt = await mediumRareStakeContract.stake({ value: ethers.utils.parseEther(amount) });
        console.log(receipt)
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
            <h3>MediumRareStake Contract</h3>
            {!!mediumRareStakeContract &&
                <div>
                    <h5>{`Contract Address: ${mediumRareStakeContract.address}`}</h5>
                    {!!stakedBalance &&
                        <p>{`Staked Balance: ${stakedBalance.toBigInt().toLocaleString()} ETH`}</p>
                    }
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
