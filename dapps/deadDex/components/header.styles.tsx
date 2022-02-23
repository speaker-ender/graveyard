import { Header2 } from "../global/typography";
import styled from "styled-components";
import { StyledWalletSelectorWrapper } from "./wallets/walletSelector.styles";
import { StyledChainSelect } from "./wallets/parts/chainSelect.styles";
import { StyledDrawer, StyledDrawerContent, StyledDrawerTitle } from "./drawer.styles";
import { StyledSelect } from "global/input.styles";

interface IStyledHeader {
}

export const StyledHeader = styled.div<IStyledHeader>`
    position: fixed;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: 1fr;
    column-gap: 25px;
    align-content: center;
    top: 0;
    width: 100vw;
    background: var(--tertiary);
    color: var(--text);
    z-index: 100;

    & ${StyledChainSelect} {
        display: contents;

        & ${StyledSelect} {
            grid-column: 3 / span 1;
            grid-row: 1;
            margin-top: auto;
            margin-bottom: auto;
        }
    }

    & ${StyledWalletSelectorWrapper} {
        display: contents;
    }

    & ${StyledDrawer} {
        display: contents;
    }

    & ${StyledDrawerTitle} {
        grid-column: 4 / span 1;
        grid-row: 1;
        margin-top: auto;
        margin-bottom: auto;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
    }
    & ${StyledDrawerContent} {
        grid-column: 4 / span 1;
        grid-row: 2;
        align-self: flex-end;
    }
`;

export const StyledHeaderTitle = styled(Header2)`
    grid-column: 1 / span 2;
    grid-row: 1;
    margin: 0.5rem;
    margin-left: 0;
    margin-right: 0;
    width: 50vw;
    mix-blend-mode: invert;
`;