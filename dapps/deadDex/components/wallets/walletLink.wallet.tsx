import { hooks, walletLink } from '../../connectors/walletLink.connector'
import { Status } from "./parts/status";
import { CurrentChain } from "./parts/currentChain";
import { Accounts } from "./parts/accounts";
import WalletControls from "./wallet.controls";
import { useCallback, useEffect, useState } from 'react';
import { lightOrDark } from '../../helpers/theme.helpers';
import { StyledMetaMaskWallet } from './metamask.wallet.styles';
import ContractFactory from '../contracts/contractFactory';


// const { useChainId, useAccount, useError, useIsActivating, useIsActive, useProvider, useENSNames } = hooks

const WalletLinkWallet = () => {
    const account = hooks.useAccount()
    const isActive = hooks.useIsActive()
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

                <b>Wallet Link</b>

                <Status connector={walletLink} hooks={hooks} />
                <CurrentChain hooks={hooks} />
                <Accounts hooks={hooks} />
                <WalletControls connector={walletLink} hooks={hooks} />
            </StyledMetaMaskWallet>

            {isActive &&
                <ContractFactory hooks={hooks} accountColor={accountColor} />
            }
        </>
    )
}

export default WalletLinkWallet;