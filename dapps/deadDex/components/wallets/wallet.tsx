import * as React from "react"
import { Status } from "./parts/status";
import { CurrentChain } from "./parts/currentChain";
import { Accounts } from "./parts/accounts";
import { FC, useCallback, useEffect, useState } from "react";
import { lightOrDark } from "../../helpers/theme.helpers";
import { StyledWallet } from "./wallet.styles";
import WalletControls from "./wallet.controls";
import { Web3ReactHooks } from "@web3-react/core";
import { Connector } from "@web3-react/types";
import { MetaMask } from "@web3-react/metamask";
import { WalletConnect } from "@web3-react/walletconnect";
import { WalletLink } from "@web3-react/walletlink";
import { Network } from '@web3-react/network'
import { useGeneratedColorTheme } from "hooks/theme.hooks";

interface IWallet {
    hooks: Web3ReactHooks;
    connector: MetaMask | WalletConnect | WalletLink | Network;
}

const Wallet: FC<IWallet> = ({ hooks, connector }) => {
    const account = hooks.useAccount();
    const { backgroundColor, textColor, updateBackgroundColor } = useGeneratedColorTheme();

    useEffect(() => {
        !!account && updateBackgroundColor(account);
        return () => {
        }
    }, [account, updateBackgroundColor])

    return (
        <StyledWallet style={{ 'backgroundColor': backgroundColor, 'color': textColor }}>
            <Status connector={connector as Connector} hooks={hooks} />
            <CurrentChain hooks={hooks} />
            <Accounts hooks={hooks} />
            <WalletControls connector={connector} hooks={hooks} />
        </StyledWallet>
    )
}

export default Wallet
