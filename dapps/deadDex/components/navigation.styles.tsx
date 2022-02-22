import { LinkStyles } from "global/link.styles";
import { Header3Style } from "global/typography";
import styled from "styled-components";

interface IStyledNavigation {
    open: boolean;
}

export const StyledNavigation = styled.div<IStyledNavigation>`
    top: 0;
    left: 0;
    margin-top: 100px;
    opacity: ${props => props.open ? '1' : '0'};
    pointer-events: ${props => props.open ? '' : 'none'};
`;

export const StyledNavigationLink = styled.div`
    ${Header3Style}
    display: inline-block;
    width: 100%;

    & a {
        ${LinkStyles}
    }
`;