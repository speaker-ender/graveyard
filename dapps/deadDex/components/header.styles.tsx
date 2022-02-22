import { Header2 } from "../global/typography";
import styled from "styled-components";
import { StyledWalletSelectorWrapper } from "./wallets/walletSelector.styles";
import { StyledChainSelect } from "./wallets/parts/chainSelect.styles";

interface IStyledHeader {
}

export const StyledHeader = styled.div<IStyledHeader>`
    position: fixed;
    top: 0;
    width: 100vw;
    background: var(--tertiary);
    color: var(--text);
    z-index: 100;

    & ${StyledChainSelect} {
        display: inline-block;
    }

    & ${StyledWalletSelectorWrapper} {
        display: inline-block;
    }
`;

export const StyledHeaderTitle = styled(Header2)`
    display: inline-block;
    margin: 0.5rem;
    mix-blend-mode: invert;
    margin-left: 0;
    margin-right: 0;
`;