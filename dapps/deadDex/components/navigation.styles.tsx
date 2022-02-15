// import { LAYERS } from "global/layers.styles";
// import { COLORS } from "global/styles";
// import { Header3 } from "global/typeography.styles";
import { Header3Style } from "global/typography";
import styled from "styled-components";

interface IStyledNavigation {
    open: boolean;
}

export const StyledNavigation = styled.div<IStyledNavigation>`
    top: 0;
    left: 0;
    opacity: ${props => props.open ? '1' : '0'};
    pointer-events: ${props => props.open ? '' : 'none'};
`;

export const StyledNavigationLink = styled.div`
    ${Header3Style}
    display: inline-block;
    width: 100%;
`;