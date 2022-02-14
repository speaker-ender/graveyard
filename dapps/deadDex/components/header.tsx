import dynamic from "next/dynamic";
import * as React from "react";
import { StyledHeader, StyledHeaderTitle } from "./header.styles";

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
            <WalletSelector />
        </StyledHeader>
    )
}

export default Header;