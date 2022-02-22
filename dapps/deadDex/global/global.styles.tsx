import { createGlobalStyle, css } from "styled-components";
import { darkThemeProps, lightThemeProps } from "./theme.styles";

export const GlobalStyle = createGlobalStyle`
  :root {
    // define light theme values as the defaults within the root selector
    ${lightThemeProps}

    // override with dark theme values within media query
    @media (prefers-color-scheme: dark) {
      ${darkThemeProps}
    }
  }

  body {
    margin: 0;
    background: var(--background);
  }
`