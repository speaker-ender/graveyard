// import { gradient } from "global/animation.styles";
// import { LAYERS } from "global/layers.styles";
// import { COLORS } from "global/styles";
import { Header2, Header2Style } from "../global/typography";
import styled from "styled-components";

interface IStyledDrawer {
    open: boolean;
}

export const StyledDrawer = styled.div<IStyledDrawer>`
`;

export const StyledDrawerTitle = styled.div<IStyledDrawer>`
    ${Header2Style}
    cursor: pointer;
    user-select: none;

    &::after {
        content: ${props => props.open ? '"-"' : '"+"'};
        display: inline-block;
        /* position: relative; */
        color: white;
    }
`;

export const StyledDrawerContent = styled.div<IStyledDrawer>`
    opacity: ${props => props.open ? 1 : 0};
    height: ${props => props.open ? "100%" : "0px"};
    pointer-events: ${props => props.open ? "all" : "none"};
    overflow: hidden
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