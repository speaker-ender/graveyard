import { Header2Style } from "../global/typography";
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
    }
`;

export const StyledDrawerContent = styled.div<IStyledDrawer>`
    opacity: ${props => props.open ? 1 : 0};
    height: ${props => props.open ? "100%" : "0px"};
    pointer-events: ${props => props.open ? "all" : "none"};
    overflow: hidden
`;