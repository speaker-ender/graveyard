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

interface IWallet {
    hooks: Web3ReactHooks;
    connector: MetaMask | WalletConnect | WalletLink | Network;
}

const Wallet: FC<IWallet> = ({ hooks, connector }) => {
    const account = hooks.useAccount();
    const [accountColor, setAccountColor] = useState<string>(null!);
    const [textColor, setTextColor] = useState<string>(null!);


    const getAccountColor = (account: string) => {
        const color = account.substring(2).substring(0, 6);
        return `#${color}`;
    }

    const updateAccountColor = useCallback(async (account: string) => {
        setAccountColor(getAccountColor(account));
    }, [accountColor, setAccountColor]);

    const updateTextColor = useCallback(() => {
        const theme = lightOrDark(accountColor);
        setTextColor(theme == 'dark' ? 'white' : 'black');
    }, [accountColor, setTextColor]);

    useEffect(() => {
        !!accountColor && updateTextColor();
        return () => {
        }
    }, [accountColor])

    useEffect(() => {
        account && updateAccountColor(account);
        return () => {
        }
    }, [account, setAccountColor])

    return (
        <StyledWallet style={{ 'backgroundColor': accountColor, 'color': textColor }}>
            <Status connector={connector as Connector} hooks={hooks} />
            <CurrentChain hooks={hooks} />
            <Accounts hooks={hooks} />
            <WalletControls connector={connector} hooks={hooks} />
        </StyledWallet>
    )
}

export default Wallet
