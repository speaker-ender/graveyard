import dynamic from "next/dynamic";
import * as React from "react";
import { StyledHeader, StyledHeaderTitle } from "./header.styles";

const ChainSelect = dynamic(() => import('./wallets/parts/chainSelect'), { ssr: false });
const WalletSelector = dynamic(() => import('./wallets/walletSelector'), { ssr: false });

interface IHeader {
    updateNavOpen: (navState?: boolean) => void;
}

const Header: React.FC<IHeader> = (props) => {

    // const handleClick = () => {
    //     props.updateNavOpen()
    // }

    return (
        <StyledHeader>
            <StyledHeaderTitle>
                Dead D3X
            </StyledHeaderTitle>
            <ChainSelect />
            <WalletSelector />
        </StyledHeader>
    )
}

export default Header;