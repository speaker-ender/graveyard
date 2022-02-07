import * as React from "react"
import { hooks, metaMask } from '../connectors/metaMask';
import { MetaMaskWallet } from "./wallet/metamask/metamaskWallet";
import { Status } from "./wallet/status";
import { ChainId } from "./wallet/chainId";
import { Accounts } from "./wallet/accounts";
import Contracts from "./contracts";
import { useCallback, useEffect, useState } from "react";
import { lightOrDark } from "../helpers/textStyle";

const MetaMaskComponent = () => {
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
        <div style={{ 'backgroundColor': accountColor, 'color': textColor }}>
            <h2>Web3 React Connections</h2>
            <Status connector={metaMask} hooks={hooks} />
            <ChainId hooks={hooks} />
            <Accounts hooks={hooks} />
            <MetaMaskWallet connector={metaMask} hooks={hooks} />
            <Contracts hooks={hooks} />
        </div>
    )
}

export default MetaMaskComponent
