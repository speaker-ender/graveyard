import * as React from "react";
import Head from 'next/head';
// import Navigation from "components/navigation";
import { useState } from "react";
import dynamic from "next/dynamic";
import Header from "../components/header";
import { FC } from "react";

const ActiveConnectorContextProvider = dynamic<{}>(() => import('hooks/connector.hooks').then((mod) => mod.ActiveConnectorContextProvider), { ssr: false });

const MetaMaskWallet = dynamic(() => import('../components/wallets/metamask.wallet'), { ssr: false });
const WalletConnectWallet = dynamic(() => import('../components/wallets/walletConnect.wallet'), { ssr: false });
const WalletLinkWallet = dynamic(() => import('../components/wallets/walletLink.wallet'), { ssr: false });

const Layout: React.FC = ({ children }) => {
    const [navOpen, setNavOpen] = useState(false);


    const updateNavOpen = React.useCallback((newNavState?: boolean) => {
        console.log('trying to change nav state');
        setNavOpen(newNavState || !navOpen);
    }, [navOpen, setNavOpen]);

    return (
        <ActiveConnectorContextProvider>
            <div className="container">
                <style jsx global>
                    {`
                    body {
                        margin: 0;
                        background: black;
                    }`
                    }
                </style>
                <Head>
                    <title>Dead D3X</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <main>
                    <Header updateNavOpen={updateNavOpen} />
                    {/* <Navigation open={navOpen} updateNavOpen={updateNavOpen} /> */}
                    <MetaMaskWallet />
                    <WalletConnectWallet />
                    <WalletLinkWallet />
                    {children}
                </main>
            </div>
        </ActiveConnectorContextProvider>
    )
}

export default Layout;