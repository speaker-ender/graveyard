import { ButtonStyles } from "global/button.styles";
import styled from "styled-components";

export const StyledInvertThemeButton = styled.button`
    ${ButtonStyles}

    &::after {
        content: ${props => props.theme.isInvert ? '"Light"' : '"Dark"'};
        display: block;
    }

    @media (prefers-color-scheme: dark) {
        &::after {
        content: ${props => props.theme.isInvert ? '"Dark"' : '"Light"'};
        }
    }
`;
