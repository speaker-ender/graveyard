import * as React from "react"
import { hooks, metaMask } from '../../connectors/metamask.connector';
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

const Wallet = () => {
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
        <>
            <StyledMetaMaskWallet style={{ 'backgroundColor': accountColor, 'color': textColor }}>
                <Status connector={metaMask} hooks={hooks} />
                <CurrentChain hooks={hooks} />
                <Accounts hooks={hooks} />
                <WalletControls connector={metaMask} hooks={hooks} />
            </StyledMetaMaskWallet>

            {/* <DeadCoinContract hooks={hooks} />
            <MediumRareStakeContract hooks={hooks} /> */}
            <ContractFactory hooks={hooks} accountColor={accountColor} />
        </>
    )
}

export default Wallet
