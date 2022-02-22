import { createGlobalStyle } from "styled-components";
import { darkThemeProps, lightThemeProps } from "./theme.styles";

export const GlobalStyle = createGlobalStyle`
  :root {
    ${props => props.theme.isInvert ? darkThemeProps : lightThemeProps}

    @media (prefers-color-scheme: dark) {
        ${props => props.theme.isInvert ? lightThemeProps : darkThemeProps}
    }
  }

  body {
    margin: 0;
    background: var(--background);
  }
`