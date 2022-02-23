import { Header3Style, Header4Style } from "../../global/typography";
import styled from "styled-components";
import { StyledDrawerContent, StyledDrawerTitle } from "components/drawer.styles";

export const StyledWalletSelector = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    padding: 25px;
    border-radius: ${props => props.theme.rounding.borderRadius};
    background-color: var(--tertiary);
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
