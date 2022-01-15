import * as React from "react"
import loadable from '@loadable/component';
import { ethers } from "ethers";
import { useCallback, useEffect, useRef } from "react";
const Ethers = loadable.lib(() => import('ethers'));

interface IWindow extends Window {
    ethereum?: any
}

const MetaMask = () => {
    let ethersjs = useRef<typeof ethers>(null);
    // let provider = useRef<typeof ethers.providers>(null);
    // A Web3Provider wraps a standard Web3 provider, which is
    // what MetaMask injects as window.ethereum into each page
    const provider = new ethers.providers.Web3Provider((window as IWindow).ethereum)

    // The MetaMask plugin also allows signing transactions to
    // send ether and pay to change state within the blockchain.
    // For this, you need the account signer...
    const signer = provider.getSigner();

    useEffect(() => {
        console.log(provider);
        console.log(signer);

        return () => {
        }
    }, [signer]);

    const getEthersData = useCallback(async () => {
        // Look up the current block number
        await provider.getBlockNumber()
        // 13722573
        // Get the balance of an account (by address or ENS name, if supported by network)
        const balance = await provider.getBalance("ethers.eth")
        // { BigNumber: "2337132817842795605" }

        // Often you need to format the output to something more user-friendly,
        // such as in ether (instead of wei)
        ethers.utils.formatEther(balance)
        // '2.337132817842795605'

        // If a user enters a string in an input field, you may need
        // to convert it from ether (as a string) to wei (as a BigNumber)
        ethers.utils.parseEther("1.0")
        // { BigNumber: "1000000000000000000" }
        console.log(ethers.utils.formatEther(balance));

        return balance;
    }, [provider]);

    const connectWallet = useCallback(async () => {
        const accounts = await provider.send("eth_requestAccounts", []);
        console.log(accounts);

        const ethereum = (window as IWindow).ethereum;

        accounts[0] && alert(`You have connected your wallet with address: ${accounts[0]}`);
        // Look up the current block number
    }, [(window as IWindow).ethereum]);

    return (
        <div>
            <Ethers ref={node => { ethersjs.current = node; }} />
            <div>
                {`Has MetaMask: ${!!(window as IWindow).ethereum}`}
                {`EthersData: ${getEthersData()}`}
            </div>
            <button onClick={() => connectWallet()}>Connect Wallet</button>
        </div>
    )
}

export default MetaMask
