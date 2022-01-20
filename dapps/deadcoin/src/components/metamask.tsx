import * as React from "react"
import loadable from '@loadable/component';
import { ethers } from "ethers";
import { useCallback, useEffect, useRef, useState } from "react";

const Ethers = loadable.lib(() => import('ethers'));

interface IWindow extends Window {
    ethereum?: any
}

const HARDHAT_NETWORK_ID = '31337';

const MetaMask = () => {
    let ethersjs = useRef<typeof ethers>(null);

    // let provider = useRef<typeof ethers.providers>(null);
    // A Web3Provider wraps a standard Web3 provider, which is
    // what MetaMask injects as window.ethereum into each page
    const [provider, setProvider] = useState(new ethers.providers.Web3Provider((window as IWindow).ethereum));
    const [walletAddress, setWalletAddress] = useState<string>(null);
    const [network, setNetwork] = useState<string>(null);

    // The MetaMask plugin also allows signing transactions to
    // send ether and pay to change state within the blockchain.
    // For this, you need the account signer...
    const signer = provider.getSigner();

    useEffect(() => {
        console.log('provider changed')
        setProvider(new ethers.providers.Web3Provider((window as IWindow).ethereum));

        return () => {
        }
    }, [(window as IWindow).ethereum]);

    const maybeUpdateNetwork = useCallback(async () => {
        const newNetwork = await provider.getNetwork();
        console.log(newNetwork);
        if (newNetwork.name !== network) {
            console.log('new network');
            newNetwork && setNetwork(newNetwork.name);
            setProvider(new ethers.providers.Web3Provider((window as IWindow).ethereum));
        }
        // Look up the current block number
    }, [network]);

    const getEthersData = useCallback(async () => {
        // maybeUpdateNetwork();
        // Look up the current block number
        await provider.getBlockNumber()
        // 13722573
        // Get the balance of an account (by address or ENS name, if supported by network)
        const balance = await provider.getBalance(walletAddress)
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
    }, [walletAddress]);

    const connectWallet = useCallback(async () => {
        maybeUpdateNetwork();
        const accounts = await provider.send("eth_requestAccounts", []);
        console.log(accounts);

        accounts[0] && setWalletAddress(accounts[0]);
    }, [provider, maybeUpdateNetwork]);

    const addToken = useCallback(async () => {
        const tokenAddress = 'asdf';
        const tokenSymbol = 'DEAD';
        const tokenDecimals = '10000';
        const tokenImage = 'url.com';
        provider.jsonRpcFetchFunc

        const params = [{
            type: "ERC20",
            options: {
                address: tokenAddress,
                symbol: tokenSymbol,
                decimals: tokenDecimals,
                image: tokenImage,
            },
        },
        ];

        // provider.sendAsync('metamask_watchAsset', params).then((err: string) => {
        //     console.log('provider returned', err)
        // })
    }, []);

    return (
        <div>
            <h2>Hand Crafted Connections</h2>
            <Ethers ref={node => { ethersjs.current = node; }} />
            <div>
                {`Has MetaMask: ${!!(window as IWindow).ethereum}`}
                {`EthersData: ${walletAddress && getEthersData()}`}
            </div>
            <button onClick={() => connectWallet()}>Connect Wallet</button>
            {walletAddress &&
                <div>Wallet Address: {walletAddress}</div>
            }
            {network &&
                <div>On Network: {network}</div>
            }

            <button onClick={() => addToken()}
            >Watch in Wallet</button>
        </div>
    )
}

export default MetaMask
