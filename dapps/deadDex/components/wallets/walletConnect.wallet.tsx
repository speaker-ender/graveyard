import * as React from "react"
import { hooks, walletConnect } from '../../connectors/walletConnect.connector';
import { Status } from "./parts/status";
import { CurrentChain } from "./parts/currentChain";
import { Accounts } from "./parts/accounts";
import { useCallback, useEffect, useState } from "react";
import { lightOrDark } from "../../helpers/theme.helpers";
import DeadCoinContract from "../contracts/deadCoin";
import { StyledMetaMaskWallet } from "./metamask.wallet.styles";
import MediumRareStakeContract from "../contracts/mediumRareStake";
import ContractFactory from "../contracts/contractFactory";
import WalletControls from "./wallet.controls";

export default function WalletConnectWallet() {
    const account = hooks.useAccount();
    const isActive = hooks.useIsActive();
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
        <>
            <StyledMetaMaskWallet style={{ 'backgroundColor': accountColor, 'color': textColor }}>

                <b>WalletConnect</b>

                <Status connector={walletConnect} hooks={hooks} />
                <CurrentChain hooks={hooks} />
                <Accounts hooks={hooks} />
                <WalletControls connector={walletConnect} hooks={hooks} />
            </StyledMetaMaskWallet>

            {isActive &&
                <ContractFactory hooks={hooks} accountColor={accountColor} />
            }

        </>
    )
}
