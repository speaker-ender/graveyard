import { Header3Style, Header4Style } from "../../global/typography";
import styled from "styled-components";
import { StyledDrawerContent, StyledDrawerTitle } from "components/drawer.styles";

export const StyledWalletSelector = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    background-color: black;
`;

export const StyledWalletSelectorWrapper = styled.div`
    margin-left: 0;
    margin-right: 0;

    & ${StyledDrawerTitle} {
        ${Header3Style}
    }

    & ${StyledDrawerContent} {
        position: relative;
        overflow: visible;
    }
`;

export const StyledWalletSelectorOption = styled.div`
`;

export const StyledWalletSelectorTitle = styled.div`
    ${Header4Style}
`;
