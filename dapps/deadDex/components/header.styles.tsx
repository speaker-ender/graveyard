// import { gradient } from "global/animation.styles";
// import { LAYERS } from "global/layers.styles";
// import { COLORS } from "global/styles";
import { Header2 } from "../global/typography";
import styled from "styled-components";
import { StyledWalletSelectorWrapper } from "./wallets/walletSelector.styles";
import { StyledChainSelect } from "./wallets/parts/chainSelect.styles";

interface IStyledHeader {
}

export const StyledHeader = styled.div<IStyledHeader>`
    /* position: fixed; */
    top: 0;
    width: 100vw;
    background: black;
    color: white;
    z-index: 100;

    & ${StyledChainSelect} {
        display: inline-block;
        width: 25vw;
    }

    & ${StyledWalletSelectorWrapper} {
        display: inline-block;
        width: 25vw;
    }
`;

export const StyledHeaderTitle = styled(Header2)`
    display: inline-block;
    margin: 0.5rem;
    mix-blend-mode: difference;
    width: 50vw;
    margin-left: 0;
    margin-right: 0;
`;

// export const StyledEnderNav = styled(Header3)`
//     display: inline;
//     width: 100%;
//     margin: 0.5rem;
//     align-self: right;
//     text-align: right;
//     cursor: pointer;
//     z-index: ${LAYERS.header};
//     mix-blend-mode: difference;

//     svg {
//         width: 35px;
//         height: 35px;
//         fill: white;
//         padding: 9px;
//     }
// `;